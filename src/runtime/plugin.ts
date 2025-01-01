import "@azure/core-tracing"
import { getResponseStatus, getHeader, getCookie, H3Event, getRequestHeader } from 'h3'
import type { NitroApp, NitroAppPlugin } from 'nitropack'
import defu from 'defu'
import type { TNitroAppInsightsConfig } from '../types'
import { useRuntimeConfig } from '#imports'
import _Applicationinsights from 'applicationinsights'
import { diag, DiagConsoleLogger, DiagLogLevel, } from "@opentelemetry/api"
import { metrics, trace } from "@opentelemetry/api";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { UndiciInstrumentation } from "@opentelemetry/instrumentation-undici"
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http"


diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const Applicationinsights = _Applicationinsights as typeof import('applicationinsights')
export default <NitroAppPlugin>(() => {
  const { applicationinsights } = useRuntimeConfig()
  const config: TNitroAppInsightsConfig = defu(applicationinsights, {
    connectionString: undefined,
    autoCollectRequests: true,
    autoCollectConsole: true,
    autoCollectDependencies: true,
    autoCollectExceptions: true,
    autoCollectPerformance: true,
    autoCollectHeartbeat: true,
    autoCollectIncomingRequestAzureFunctions: true,
    autoCollectPreAggregatedMetrics: true,
    autoDependencyCorrelation: true,
    enableWebInstrumentation: false,
    distributedTracingMode: Applicationinsights.DistributedTracingModes.AI_AND_W3C,
    sendLiveMetrics: true,
    internalLogging: {
      enableDebugLogging: true,
      enableWarningLogging: true
    },
    useDiskRetryCaching: true
  })

  setup(config)

  const instrumentations = [
    new UndiciInstrumentation(),
    new HttpInstrumentation()
  ];

  registerInstrumentations({
    tracerProvider: trace.getTracerProvider(),
    meterProvider: metrics.getMeterProvider(),
    instrumentations: instrumentations,
  });
})


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
    .setSendLiveMetrics(config.sendLiveMetrics).setInternalLogging(true, true) // Enable both debug and warning logging
    .setAutoCollectConsole(true, true) // Generate Trace telemetry for winston/bunyan and console logs

    .setUseDiskRetryCaching(config.useDiskRetryCaching)
  // todo fix this
  // if (typeof config.autoCollectPerformance === 'object') {
  //   configuration.setAutoCollectPerformance(
  //     config.autoCollectPerformance.value, config.autoCollectPerformance.collectExtendedMetrics)
  // } else {
  //   configuration.setAutoCollectPerformance(
  //     config.autoCollectPerformance)
  // }

  // if (typeof config.autoDependencyCorrelation === 'object') {
  //   configuration.setAutoDependencyCorrelation(config.autoDependencyCorrelation.value, config.autoDependencyCorrelation.useAsyncHooks)
  // } else {
  //   configuration.setAutoDependencyCorrelation(config.autoDependencyCorrelation)
  // }

  // if (typeof config.enableWebInstrumentation === 'object') {
  //   configuration.enableWebInstrumentation(config.enableWebInstrumentation.value, config.enableWebInstrumentation.WebSnippetConnectionString)
  // } else {
  //   configuration.enableWebInstrumentation(config.enableWebInstrumentation)
  // }

  // if (typeof config.autoCollectConsole === 'object') {
  //   configuration.setAutoCollectConsole(config.autoCollectConsole.value, config.autoCollectConsole.collectConsoleLogs)
  // } else {
  //   configuration.setAutoCollectConsole(config.autoCollectConsole)
  // }

  // if (typeof config.internalLogging === 'object') {
  //   configuration.setInternalLogging(config.internalLogging.enableDebugLogging, config.internalLogging.enableWarningLogging)
  // } else {
  //   configuration.setInternalLogging(config.internalLogging)
  // }

  return configuration.start()
}
