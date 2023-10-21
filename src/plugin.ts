import { DistributedTracingModes } from 'applicationinsights'
import { getResponseStatus, getHeader, getCookie, H3Event } from 'h3'
import Traceparent from 'applicationinsights/out/Library/Traceparent.js'
import TelemetryClient from 'applicationinsights/out/Library/NodeClient.js'
import { NitroApp } from 'nitropack/types'
import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin'
import { setup } from './setup'
import { TNitroAppInsightsConfig } from './types'

export default defineNitroPlugin(async (nitro) => {
  const config: TNitroAppInsightsConfig = {
    connectionString: undefined,
    autoCollectRequests: Boolean(process.env.APPINSIGHTS_AUTO_COLLECT_REQUESTS),
    autoCollectConsole:
      Boolean(process.env.APPINSIGHTS_AUTO_COLLECT_CONSOLE),
    autoCollectDependencies:
      Boolean(process.env.APPINSIGHTS_AUTO_COLLECT_DEPENDENCIES),
    autoCollectExceptions: Boolean(process.env.APPINSIGHTS_AUTO_COLLECT_EXCEPTIONS),
    autoCollectPerformance: Boolean(process.env.APPINSIGHTS_AUTO_COLLECT_PERFORMANCE),
    autoCollectHeartbeat: Boolean(process.env.APPINSIGHTS_AUTO_COLLECT_HEARTBEAT),
    autoCollectIncomingRequestAzureFunctions: Boolean(process.env.APPINSIGHTS_AUTO_COLLECT_AZURE_FUNCTIONS),
    autoCollectPreAggregatedMetrics: Boolean(process.env.APPINSIGHTS_AUTO_COLLECT_PREAGGREGATEDMETRICS),
    autoDependencyCorrelation: false,
    enableWebInstrumentation: false,
    distributedTracingMode: DistributedTracingModes.AI_AND_W3C,
    sendLiveMetrics: false,
    internalLogging: {
      enableDebugLogging: false,
      enableWarningLogging: false
    },
    useDiskRetryCaching: Boolean(process.env.APPINSIGHTS_DISK_RETRY_CACHING)
  }

  await nitro.hooks.callHook('applicationinsights:config', config)

  setup(config)

  // @ts-expect-error not typed ?
  nitro.hooks.hook('request', async (event: H3Event) => {
    const nitro = useNitroApp() as NitroApp
    const traceParent = getHeader(event, 'Traceparent')

    const trace = new Traceparent(traceParent)
    const client = new TelemetryClient(config.connectionString)

    // context should contain Contract tags
    client.addTelemetryProcessor((envelope, context) => {
      if (context) {
        for (const [key, val] of Object.entries(context)) {
          envelope.tags[key] = val
        }
      }
      return true
    })

    // initial traceId for this request
    trace.updateSpanId()

    // TODO get cookies list of useful cookies from appinsights
    const aiUser = getCookie(event, 'ai_user')
    const aiSession = getCookie(event, 'ai_session')
    const aiDevice = getCookie(event, 'ai_device')

    Object.assign(client.context.tags, {
      [client.context.keys.sessionId]: aiSession,
      [client.context.keys.userId]: aiUser,
      [client.context.keys.deviceId]: aiDevice
    })

    await nitro.hooks.callHook(
      'applicationinsights:context:tags',
      client,
      client.context.tags,
      { event }
    )

    event.$appInsights = {
      startTime: Date.now(),
      client,
      initialTrace: traceParent ?? trace.toString(),
      trace,
      properties: {},
      shouldTrack: true
    }
  })

  // @ts-expect-error
  nitro.hooks.hook('afterResponse', async (event: H3Event) => {
    if (event.$appInsights.shouldTrack) {
      const statusCode = getResponseStatus(event)
      const trackInfo = {
        name: `${event.method}: ${event.path}`,
        url: event.path,
        resultCode: statusCode,
        duration: Date.now() - event.$appInsights.startTime,
        success: statusCode < 400,
        properties: event.$appInsights.properties,
        contextObjects: {
          ...event.$appInsights.client.context.tags,
          // needed ?
          // [event.__appInsights.client.context.keys.operationId]: event.__appInsights.trace.traceId,
          [event.$appInsights.client.context.keys.operationParentId]:
            event.$appInsights.trace.parentId
        },
        id: event.$appInsights.trace.traceId
      }

      await nitro.hooks.callHook('applicationinsights:trackRequest:before', trackInfo)

      event.$appInsights.client.trackRequest(trackInfo)
    }
  })
})
