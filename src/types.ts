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
declare module 'h3' {
  interface H3Event {
    $appInsights: {
      startTime: number;
      client: TelemetryClient;
      trace: Traceparent;
      initialTrace: string;
      properties: Record<string, string>;
      /**
       * set false to disable tracking for this request
       */
      shouldTrack: boolean
      tags: Record<string, string|undefined>
    };
  }
}

declare module 'nitropack' {
  interface NitroRuntimeHooks {
    'applicationinsights:context:tags': (
      client: TelemetryClient,
      tags: Record<string, string|undefined>,
      context: { event: H3Event },
    ) => void;
    'applicationinsights:config': (config: TNitroAppInsightsConfig) => void
    'applicationinsights:trackRequest:before': (event: H3Event, trackObject: Parameters<TelemetryClient['trackRequest']>[0]) => void
  }
}
