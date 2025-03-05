import type { NitroAppPlugin } from 'nitropack'
import type { TNitroAppInsightsConfig } from '../types'
import { useRuntimeConfig } from '#imports'
import _Applicationinsights from 'applicationinsights'
import { metrics, trace, } from "@opentelemetry/api";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { UndiciInstrumentation } from "@opentelemetry/instrumentation-undici"
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http"
import { SEMATTRS_HTTP_URL, SEMATTRS_HTTP_HOST, SEMATTRS_HTTP_METHOD, SEMATTRS_HTTP_ROUTE, SEMATTRS_HTTP_SCHEME, SEMATTRS_HTTP_STATUS_CODE, OTEL_STATUS_CODE_VALUE_OK, OTEL_STATUS_CODE_VALUE_ERROR } from "@opentelemetry/semantic-conventions"
import { getResponseStatus, getRequestURL, getRequestProtocol } from 'h3'
import { defu } from 'defu';

const instrumentations = [
  new UndiciInstrumentation(),
  new HttpInstrumentation()
];
const loadInstrumentations = () => {
  registerInstrumentations({
    instrumentations,
  });
}
loadInstrumentations()


const Applicationinsights = _Applicationinsights as typeof import('applicationinsights')

export default <NitroAppPlugin>(async (nitro) => {
  const { applicationinsights: config } = useRuntimeConfig()

  await nitro.hooks.callHook('applicationinsights:config', defu(config, {}))

  const configuration = setup(config)
  await nitro.hooks.callHook('applicationinsights:setup', { client: Applicationinsights.defaultClient, configuration })
  configuration.start()
  await nitro.hooks.callHook('applicationinsights:ready', { client: Applicationinsights.defaultClient })

  registerInstrumentations({
    tracerProvider: trace.getTracerProvider(),
    meterProvider: metrics.getMeterProvider(),
  });
  
  nitro.hooks.hook('otel:span:end', ({event}) => {
    event.otel.span.setAttributes({
      [SEMATTRS_HTTP_STATUS_CODE]: getResponseStatus(event),
    })
  })

  // azure app insights seems to be relying on the deprecated attributes
  nitro.hooks.hook('request', async (event) => {
    const requestURL = getRequestURL(event)
    event.otel.span.setAttributes({
      [SEMATTRS_HTTP_ROUTE]: (await nitro.h3App.resolve(event.path))?.route || event.path,
      [SEMATTRS_HTTP_URL]: event.path,
      [SEMATTRS_HTTP_METHOD]: event.method,
      [SEMATTRS_HTTP_SCHEME]: getRequestProtocol(event),
      [SEMATTRS_HTTP_HOST]: requestURL.host, 
    })
  })
})


export function setup(config: TNitroAppInsightsConfig) {
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
