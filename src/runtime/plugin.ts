import ApplicationInsights, { DistributedTracingModes } from 'applicationinsights'
import { getResponseStatus, getHeader, getCookie, H3Event, getRequestHeader } from 'h3'
import Traceparent from 'applicationinsights/out/Library/Traceparent.js'
import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin'
import { TNitroAppInsightsConfig } from '../types'
import defu from 'defu'
import { setup } from './setup'
import { useRuntimeConfig } from '#imports'

export default defineNitroPlugin(async (nitro) => {
  const { applicationInsights } = useRuntimeConfig()
  const config: TNitroAppInsightsConfig = defu(applicationInsights, {
    connectionString: undefined,
    autoCollectRequests: false,
    autoCollectConsole: false,
    autoCollectDependencies: false,
    autoCollectExceptions: false,
    autoCollectPerformance: false,
    autoCollectHeartbeat: false,
    autoCollectIncomingRequestAzureFunctions: false,
    autoCollectPreAggregatedMetrics: false,
    autoDependencyCorrelation: false,
    enableWebInstrumentation: false,
    distributedTracingMode: DistributedTracingModes.AI_AND_W3C,
    sendLiveMetrics: false,
    internalLogging: {
      enableDebugLogging: false,
      enableWarningLogging: false
    },
    useDiskRetryCaching: false
  })
  await nitro.hooks.callHook('applicationinsights:config', config)

  setup(config)

  const client = ApplicationInsights.defaultClient

  // context should contain Contract tags
  client.addTelemetryProcessor((envelope, context) => {
    if (context) {
      for (const [key, val] of Object.entries(context)) {
        if (val) {
          envelope.tags[key] = val
        }
      }
    }
    return true
  })

  nitro.hooks.hook('request', async (event: H3Event) => {
    const traceParent = getHeader(event, 'Traceparent')
    const trace = new Traceparent(traceParent)

    // initial traceId for this request
    trace.updateSpanId()

    // TODO get cookies list of useful cookies from appinsights
    const aiUser = getCookie(event, 'ai_user')
    const aiSession = getCookie(event, 'ai_session')
    const aiDevice = getCookie(event, 'ai_device')
    const tags = {
      [client.context.keys.sessionId]: aiSession,
      [client.context.keys.userId]: aiUser,
      [client.context.keys.deviceId]: aiDevice
    }

    await nitro.hooks.callHook(
      'applicationinsights:context:tags',
      client,
      tags,
      { event }
    )

    event.$appInsights = {
      startTime: Date.now(),
      client,
      initialTrace: traceParent ?? trace.toString(),
      trace,
      properties: {},
      shouldTrack: true,
      tags
    }
  })

  nitro.hooks.hook('afterResponse', async (event: H3Event) => {
    if (event.$appInsights.shouldTrack) {
      const statusCode = getResponseStatus(event)
      const name = `${event.method}: ${event.path}`
      const trackInfo = {
        name,
        url: event.path,
        resultCode: statusCode,
        duration: Date.now() - event.$appInsights.startTime,
        success: statusCode < 400,
        properties: event.$appInsights.properties,
        contextObjects: {
          ...event.$appInsights.tags,
          [event.$appInsights.client.context.keys.operationParentId]:
            getRequestHeader(event, 'traceparent')?.split('-')[2] ?? event.$appInsights.trace.traceId,
          [event.$appInsights.client.context.keys.operationName]: name,
          [event.$appInsights.client.context.keys.operationId]: event.$appInsights.trace.traceId
        },
        id: event.$appInsights.trace.spanId
      }

      await nitro.hooks.callHook('applicationinsights:trackRequest:before', event, trackInfo)

      if (event.$appInsights.shouldTrack) {
        event.$appInsights.client.trackRequest(trackInfo)
      }
    }
  })

  nitro.hooks.hook('error', (error) => {
    if (ApplicationInsights.defaultClient) {
      ApplicationInsights.defaultClient.trackException({ exception: error })
    }
  })
})
