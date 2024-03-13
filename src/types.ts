/// <reference types="nitropack" />
import type { TelemetryClient, DistributedTracingModes } from 'applicationinsights'
import type Traceparent from 'applicationinsights/out/Library/Traceparent'
import type { H3Event } from 'h3'

export type TNitroAppInsightsConfig = {
  connectionString?: string
  autoCollectRequests: boolean
  autoCollectConsole: boolean | {value: boolean, collectConsoleLogs: boolean}
  autoCollectDependencies: boolean
  autoCollectExceptions: boolean
  autoCollectPerformance: boolean| {value :boolean, collectExtendedMetrics: boolean}
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