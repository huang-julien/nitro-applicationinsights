import { getResponseStatus, getHeader, getCookie, H3Event, getRequestHeader } from 'h3'
import Traceparent from 'applicationinsights/out/Library/Traceparent.js'
import type { NitroApp, NitroAppPlugin } from 'nitropack'
import defu from 'defu'
import type { TNitroAppInsightsConfig } from '../types'
import { useRuntimeConfig } from '#imports'
import _Applicationinsights from '#applicationinsights'
import type { Contracts } from '#applicationinsights'

const Applicationinsights = _Applicationinsights as typeof import('applicationinsights')
export default <NitroAppPlugin>(async (nitro) => {
  const { applicationinsights } = useRuntimeConfig()
  const config: TNitroAppInsightsConfig = defu(applicationinsights, {
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
    distributedTracingMode: Applicationinsights.DistributedTracingModes.AI_AND_W3C,
    sendLiveMetrics: false,
    internalLogging: {
      enableDebugLogging: false,
      enableWarningLogging: false
    },
    useDiskRetryCaching: false
  })
  await nitro.hooks.callHook('applicationinsights:config', config)

  setup(config)

  const client = Applicationinsights.defaultClient

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
      tags,
      requestTelemetry: {
        name: `${event.method}: ${event.context.matchedRoute?.path ?? event.path}`,
        url: event.path,
        resultCode: 0,
        duration: 0,
        success: true,
        properties: {},
        contextObjects: {
          [client.context.keys.operationParentId]:
            getRequestHeader(event, 'traceparent')?.split('-')[2] ?? trace.spanId,
          [client.context.keys.operationName]: `${event.method}: ${event.context.matchedRoute?.path ?? event.path}`,
          [client.context.keys.operationId]: trace.traceId,
          ...tags,
        },
        id: trace.spanId
      }
    }
  })

  nitro.hooks.hook('beforeResponse', async (event: H3Event) => {
    event.waitUntil(trackEvent(nitro, event))
  })

  nitro.hooks.hook('error', async (error, ctx) => {
    if (Applicationinsights.defaultClient) {
      if (!('shouldTrack' in ctx)) { ctx.shouldTrack = true }
      const exceptionTelemetry: Contracts.ExceptionTelemetry = {
        exception: error, contextObjects: {
          ...ctx.event?.$appInsights?.requestTelemetry?.contextObjects,
        }
      }

      if (ctx.event) {
        exceptionTelemetry.contextObjects = {
          [ctx.event.$appInsights.client.context.keys.operationParentId]: ctx.event.$appInsights.trace.traceId,
          [ctx.event.$appInsights.client.context.keys.operationName]: `${ctx.event.method}: ${ctx.event.path}`,
          [ctx.event.$appInsights.client.context.keys.operationId]: ctx.event.$appInsights.trace.traceId,
          ...exceptionTelemetry.contextObjects,
        }
      }

      await nitro.hooks.callHook('applicationinsights:trackError:before', exceptionTelemetry, ctx)
      if (ctx.shouldTrack) {
        Applicationinsights.defaultClient.trackException(exceptionTelemetry)
      }
    }
  })
})


async function trackEvent(nitro: NitroApp, event: H3Event) {
  if (event.$appInsights.shouldTrack) {
    const statusCode = getResponseStatus(event)
    event.$appInsights.requestTelemetry.resultCode = statusCode
    event.$appInsights.requestTelemetry.duration = Date.now() - event.$appInsights.startTime

    // compatibility with deprectaed properties and tags
    event.$appInsights.requestTelemetry.properties = { ...event.$appInsights.properties, ...event.$appInsights.requestTelemetry.properties }
    event.$appInsights.requestTelemetry.contextObjects = { ...event.$appInsights.tags, ...event.$appInsights.requestTelemetry.contextObjects }

    await nitro.hooks.callHook('applicationinsights:trackRequest:before', event, event.$appInsights.requestTelemetry)

    if (event.$appInsights.shouldTrack) {
      event.$appInsights.client.trackRequest(event.$appInsights.requestTelemetry)
    }
  }
}


export function setup(config: TNitroAppInsightsConfig) {
  // Setup Application Insights using the instrumentation key from the environment variables
  const configuration = Applicationinsights
    .setup(config.connectionString)
    .setAutoCollectRequests(config.autoCollectRequests)
    .setAutoCollectDependencies(config.autoCollectDependencies)
    .setAutoCollectExceptions(config.autoCollectExceptions)
    .setAutoCollectHeartbeat(config.autoCollectHeartbeat)
    .setAutoCollectIncomingRequestAzureFunctions(config.autoCollectIncomingRequestAzureFunctions)
    .setAutoCollectPreAggregatedMetrics(config.autoCollectPreAggregatedMetrics)
    .setDistributedTracingMode(config.distributedTracingMode)
    .setSendLiveMetrics(config.sendLiveMetrics)
    .setUseDiskRetryCaching(config.useDiskRetryCaching)

  if (typeof config.autoCollectPerformance === 'object') {
    configuration.setAutoCollectPerformance(
      config.autoCollectPerformance.value, config.autoCollectPerformance.collectExtendedMetrics)
  } else {
    configuration.setAutoCollectPerformance(
      config.autoCollectPerformance)
  }

  if (typeof config.autoDependencyCorrelation === 'object') {
    configuration.setAutoDependencyCorrelation(config.autoDependencyCorrelation.value, config.autoDependencyCorrelation.useAsyncHooks)
  } else {
    configuration.setAutoDependencyCorrelation(config.autoDependencyCorrelation)
  }

  if (typeof config.enableWebInstrumentation === 'object') {
    configuration.enableWebInstrumentation(config.enableWebInstrumentation.value, config.enableWebInstrumentation.WebSnippetConnectionString)
  } else {
    configuration.enableWebInstrumentation(config.enableWebInstrumentation)
  }

  if (typeof config.autoCollectConsole === 'object') {
    configuration.setAutoCollectConsole(config.autoCollectConsole.value, config.autoCollectConsole.collectConsoleLogs)
  } else {
    configuration.setAutoCollectConsole(config.autoCollectConsole)
  }

  if (typeof config.internalLogging === 'object') {
    configuration.setInternalLogging(config.internalLogging.enableDebugLogging, config.internalLogging.enableWarningLogging)
  } else {
    configuration.setInternalLogging(config.internalLogging)
  }

  return configuration.start()
}
