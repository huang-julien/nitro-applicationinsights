/// <reference types="nitropack" />
/// <reference types="nitro-opentelemetry" />
import type { DistributedTracingModes } from 'applicationinsights'

export type TNitroAppInsightsConfig = {
  connectionString?: string
  autoCollectRequests: boolean
  autoCollectConsole: boolean | {value: boolean, collectConsoleLogs: boolean}
  autoCollectDependencies: boolean
  autoCollectExceptions: boolean
  autoCollectPerformance: {value :boolean, collectExtendedMetrics: boolean}
  autoCollectHeartbeat: boolean
  autoCollectIncomingRequestAzureFunctions: boolean
  autoCollectPreAggregatedMetrics: boolean
  autoDependencyCorrelation: boolean | {value :boolean, useAsyncHooks :boolean}
  enableWebInstrumentation: boolean | {value: boolean, WebSnippetConnectionString?: string}
  distributedTracingMode: DistributedTracingModes
  sendLiveMetrics:boolean
  internalLogging: {enableDebugLogging?: boolean, enableWarningLogging?: boolean}
  useDiskRetryCaching: boolean
}
