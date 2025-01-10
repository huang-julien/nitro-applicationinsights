import loadInstrumentations from './instrumentations'
import type { NitroAppPlugin } from 'nitropack'
import defu from 'defu'
import type { TNitroAppInsightsConfig } from '../types'
import { useRuntimeConfig } from '#imports'
import _Applicationinsights from 'applicationinsights'
import { metrics, trace, } from "@opentelemetry/api";
// @ts-ignore wat ??
import nitroOtelPlugin from "nitro-opentelemetry/runtime/plugin.mjs"
import { registerInstrumentations } from "@opentelemetry/instrumentation";

loadInstrumentations()

const Applicationinsights = _Applicationinsights as typeof import('applicationinsights')

export default <NitroAppPlugin>(async (nitro) => {
  const { applicationinsights } = useRuntimeConfig()

  const config: TNitroAppInsightsConfig = defu(applicationinsights, {
    connectionString: undefined,
    autoCollectRequests: false,
    autoCollectConsole: false,
    autoCollectDependencies: false,
    autoCollectExceptions: false,
     autoCollectPerformance: {
      value: false,
    },
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

  registerInstrumentations({
    tracerProvider: trace.getTracerProvider(),
    meterProvider: metrics.getMeterProvider(),
  });
  // run after setup
  // we can't push it into nitro config until nitro allows for async plugins
  nitroOtelPlugin(nitro)
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

  return configuration.start()
}
