/// <reference types="nitropack" />
/// <reference types="nitro-opentelemetry" />
import type { DistributedTracingModes } from 'applicationinsights'

export type TNitroAppInsightsConfig = {
  connectionString?: string
  /**
   * @deprecated since 1.1.0 prefer using applicationinsights:setup hook and modify the configuration object
   */
  autoCollectRequests: boolean
  /**
   * @deprecated since 1.1.0 prefer using applicationinsights:setup hook and modify the configuration object
   */
  autoCollectConsole: boolean | {value: boolean, collectConsoleLogs: boolean}
  /**
   * @deprecated since 1.1.0 prefer using applicationinsights:setup hook and modify the configuration object
   */
  autoCollectDependencies: boolean
  /**
   * @deprecated since 1.1.0 prefer using applicationinsights:setup hook and modify the configuration object
   */
  autoCollectExceptions: boolean
  /**
   * @deprecated since 1.1.0 prefer using applicationinsights:setup hook and modify the configuration object
   */
  autoCollectPerformance: {value :boolean, collectExtendedMetrics: boolean}
  /**
   * @deprecated since 1.1.0 prefer using applicationinsights:setup hook and modify the configuration object
   */
  autoCollectHeartbeat: boolean
  /**
   * @deprecated since 1.1.0 prefer using applicationinsights:setup hook and modify the configuration object
   */
  autoCollectIncomingRequestAzureFunctions: boolean
  /**
   * @deprecated since 1.1.0 prefer using applicationinsights:setup hook and modify the configuration object
   */
  autoCollectPreAggregatedMetrics: boolean
  /**
   * @deprecated since 1.1.0 prefer using applicationinsights:setup hook and modify the configuration object
   */
  autoDependencyCorrelation: boolean | {value :boolean, useAsyncHooks :boolean}
  /**
   * @deprecated since 1.1.0 prefer using applicationinsights:setup hook and modify the configuration object
   */
  enableWebInstrumentation: boolean | {value: boolean, WebSnippetConnectionString?: string}
  /**
   * @deprecated since 1.1.0 prefer using applicationinsights:setup hook and modify the configuration object
   */
  distributedTracingMode: DistributedTracingModes
  /**
   * @deprecated since 1.1.0 prefer using applicationinsights:setup hook and modify the configuration object
   */
  sendLiveMetrics:boolean
  /**
   * @deprecated since 1.1.0 prefer using applicationinsights:setup hook and modify the configuration object
   */
  internalLogging: {enableDebugLogging?: boolean, enableWarningLogging?: boolean}
  /**
   * @deprecated since 1.1.0 prefer using applicationinsights:setup hook and modify the configuration object
   */
  useDiskRetryCaching: boolean
}
