import * as applicationInsights from 'applicationinsights'

export function setup () {
  // Setup Application Insights using the instrumentation key from the environment variables
  return applicationInsights
    .setup()
    .setAutoCollectRequests(
      Boolean(process.env.APPINSIGHTS_AUTO_COLLECT_REQUESTS)
    )
    .setAutoCollectConsole(
      Boolean(process.env.APPINSIGHTS_AUTO_COLLECT_CONSOLE)
    )
    .setAutoCollectDependencies(
      Boolean(process.env.APPINSIGHTS_AUTO_COLLECT_DEPENDENCIES)
    )
    .setAutoCollectExceptions(
      Boolean(process.env.APPINSIGHTS_AUTO_COLLECT_EXCEPTIONS)
    )
    .setAutoCollectPerformance(
      Boolean(process.env.APPINSIGHTS_AUTO_COLLECT_PERFORMANCE)
    )
    .setAutoCollectHeartbeat(
      Boolean(process.env.APPINSIGHTS_AUTO_COLLECT_HEARTBEAT)
    )
    .setAutoCollectIncomingRequestAzureFunctions(
      Boolean(process.env.APPINSIGHTS_AUTO_COLLECT_AZURE_FUNCTIONS)
    )
    .setAutoCollectPreAggregatedMetrics(
      Boolean(process.env.APPINSIGHTS_AUTO_COLLECT_PREAGGREGATEDMETRICS)
    )
    .setAutoDependencyCorrelation(
      Boolean(process.env.APPINSIGHTS_AUTO_COLLECT_DEPENDENCY_CORRELATION)
    )
    .enableWebInstrumentation(
      Boolean(process.env.APPINSIGHTS_ENABLE_WEB_INSTRUMENTATION)
    )
    .setDistributedTracingMode(
      applicationInsights.DistributedTracingModes.AI_AND_W3C
    )
    .setSendLiveMetrics(Boolean(process.env.APPINSIGHTS_LIVE_METRICS))
    .setInternalLogging(Boolean(process.env.APPINSIGHTS_ENABLE_VERBOSE_LOGGING))
    .setUseDiskRetryCaching(
      Boolean(process.env.APPINSIGHTS_USE_DISK_RETRY_CACHING)
    )
    .start()
}
