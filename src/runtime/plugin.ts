import type { NitroApp, NitroAppPlugin } from 'nitropack'
import type { TNitroAppInsightsConfig } from '../types'
import { useRuntimeConfig } from '#imports'
import { metrics, trace, } from "@opentelemetry/api";
import { SEMATTRS_HTTP_URL, SEMATTRS_HTTP_HOST, SEMATTRS_HTTP_METHOD, SEMATTRS_HTTP_ROUTE, SEMATTRS_HTTP_SCHEME, SEMATTRS_HTTP_STATUS_CODE } from "@opentelemetry/semantic-conventions"
import { getResponseStatus, getRequestURL, getRequestProtocol } from 'h3'
import { defu } from 'defu';

export default <NitroAppPlugin>((nitro) => {
  let enabled = false
  const ready = initialize(nitro)
    .then((started) => { enabled = started === true })
    .catch((error) => {
      nitro.captureError(error, { tags: ['applicationinsights'] })
    })

  // block requests until the SDK is initialized
  const unhook = nitro.hooks.hook('request', () => ready)
  ready.finally(unhook)
 
  nitro.hooks.hook('otel:span:end', async ({ event }) => {
    if (!enabled) { return }

    const requestURL = getRequestURL(event)
    event.otel.span.setAttributes({
      [SEMATTRS_HTTP_ROUTE]: (await nitro.h3App.resolve(event.path))?.route || event.path,
      [SEMATTRS_HTTP_URL]: event.path,
      [SEMATTRS_HTTP_METHOD]: event.method,
      [SEMATTRS_HTTP_SCHEME]: getRequestProtocol(event),
      [SEMATTRS_HTTP_HOST]: requestURL.host,
      [SEMATTRS_HTTP_STATUS_CODE]: getResponseStatus(event),
    })
  })
})

async function initialize(nitro: NitroApp): Promise<boolean> {
  const config = defu(useRuntimeConfig().applicationinsights, {}) as TNitroAppInsightsConfig

  await nitro.hooks.callHook('applicationinsights:config', config)

  // applicationinsights use the connection string from the config or from the environment variables
  const connectionString = config.connectionString
    || process.env.APPLICATIONINSIGHTS_CONNECTION_STRING
    || process.env.APPINSIGHTS_INSTRUMENTATIONKEY

  // skip loading the whole applicationinsights graph when telemetry cannot be sent anywhere
  if (!connectionString) { return false }

  const [appInsightsModule, { registerInstrumentations }, { UndiciInstrumentation }, { HttpInstrumentation }] = await Promise.all([
    import('applicationinsights'),
    import('@opentelemetry/instrumentation'),
    import('@opentelemetry/instrumentation-undici'),
    import('@opentelemetry/instrumentation-http'),
  ])
  const Applicationinsights = (appInsightsModule.default ?? appInsightsModule) as typeof import('applicationinsights')

  const configuration = setup(Applicationinsights, config)
  await nitro.hooks.callHook('applicationinsights:setup', { client: Applicationinsights.defaultClient, configuration })
  configuration.start()
  await nitro.hooks.callHook('applicationinsights:ready', { client: Applicationinsights.defaultClient })

  registerInstrumentations({
    instrumentations: [
      new UndiciInstrumentation(),
      new HttpInstrumentation(),
    ],
    tracerProvider: trace.getTracerProvider(),
    meterProvider: metrics.getMeterProvider(),
  });
  return true
}


function setup(Applicationinsights: typeof import('applicationinsights'), config: TNitroAppInsightsConfig) {
  // Setup Application Insights using the instrumentation key from the environment variables
  const configuration = Applicationinsights.setup(config.connectionString)

  if (config.autoCollectRequests !== undefined) {
    configuration.setAutoCollectRequests(config.autoCollectRequests)
  }

  if (config.autoCollectDependencies !== undefined) {
    configuration.setAutoCollectDependencies(config.autoCollectDependencies)
  }

  if (config.autoCollectExceptions !== undefined) {
    configuration.setAutoCollectExceptions(config.autoCollectExceptions)
  }

  if (config.autoCollectHeartbeat !== undefined) {
    configuration.setAutoCollectHeartbeat(config.autoCollectHeartbeat)
  }

  if (config.autoCollectIncomingRequestAzureFunctions !== undefined) {
    configuration.setAutoCollectIncomingRequestAzureFunctions(config.autoCollectIncomingRequestAzureFunctions)
  }

  if (config.autoCollectPreAggregatedMetrics !== undefined) {
    configuration.setAutoCollectPreAggregatedMetrics(config.autoCollectPreAggregatedMetrics)
  }

  if (config.distributedTracingMode !== undefined) {
    configuration.setDistributedTracingMode(config.distributedTracingMode)
  }

  if (config.sendLiveMetrics !== undefined) {
    configuration.setSendLiveMetrics(config.sendLiveMetrics)
  }

  if (config.useDiskRetryCaching !== undefined) {
    configuration.setUseDiskRetryCaching(config.useDiskRetryCaching)
  }

  if (typeof config.autoCollectPerformance === 'object') {
    configuration.setAutoCollectPerformance(config.autoCollectPerformance.value, config.autoCollectPerformance.collectExtendedMetrics)
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

  return configuration
}
