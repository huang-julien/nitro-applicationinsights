import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin'
import { DistributedTracingModes } from 'applicationinsights'
import { setup } from './setup'
import middleware from './middleware'
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

  nitro.h3App.use(middleware)

  nitro.hooks.hook('render:response', async (response, { event }) => {
    if (event.$appInsights.shouldTrack) {
      const trackInfo = {
        name: `${event.method}: ${event.path}`,
        url: event.path,
        resultCode: response.statusCode ?? 0,
        duration: Date.now() - event.$appInsights.startTime,
        success: response.statusCode ? response.statusCode < 400 : false,
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
