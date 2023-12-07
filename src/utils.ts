import type { H3Event } from "h3";
import { Nitro, NitroFetchOptions } from "nitropack";
import type { FetchOptions } from "ofetch";

/**
 * return an object with the traceparent
 * @param {H3Event} event - The event object from h3.
 * @param {Record<string, string>} headers - optional headers to add to the object
 */
export function getTraceparentHeader(event: H3Event, headers: HeadersInit = {}): HeadersInit {
    return Object.assign(headers, {
        traceparent: event.$appInsights.trace.toString()
    })
}

/**
 * Retrieves the telemetry client associated with the H3Event.
 * @param {H3Event} event - The event object from h3.
 * @returns {TelemetryClient} The telemetry client from `applicationinsights`.
 */
export function getEventTelemetryClient(event: H3Event) {
    return event.$appInsights.client
}


/**
 * Returns the FetchOptions object with interceptors for tracking dependencies and exceptions.
 * Note that if you need to set this dependency as children of an event, the event must 
 * @param event - The H3Event object.
 * @returns The FetchOptions object.
 */
export function get$FetchInterceptors(event?: H3Event): NitroFetchOptions<any, any> {
    let startTime: number | undefined
    const contextObjects: Record<string, string> = {}
    if (event) {
        contextObjects[event.$appInsights.client.context.keys.operationId] = event.$appInsights.trace.toString()
        contextObjects[event.$appInsights.client.context.keys.operationParentId] = event.$appInsights.trace.traceId
    }
    return {
        onRequest(context) {
            if (event) {
                context.options.headers = getTraceparentHeader(event, context.options.headers ?? {})
            }
            startTime = Date.now()
        },
        onRequestError(context) {
            event?.$appInsights.client.trackException(
                {
                    contextObjects,
                    exception: context.error,
                })
        },
        onResponse(context) {
            event?.$appInsights.client.trackDependency({
                dependencyTypeName: 'HTTP',
                duration: startTime ? (Date.now() - startTime) : 0,
                name: context.response.url,
                data: '',
                resultCode: context.response.status,
                success: true,
                contextObjects
            })
        },
        onResponseError(context) {
            event?.$appInsights.client.trackDependency({
                dependencyTypeName: 'HTTP',
                duration: startTime ? (Date.now() - startTime) : 0,
                name: context.response.url,
                data: '',
                resultCode: context.response.status,
                success: false,
                contextObjects
            })
        },
    }
}