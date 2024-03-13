import type { TelemetryClient } from 'applicationinsights'
import type Traceparent from 'applicationinsights/out/Library/Traceparent'
import type { H3Event } from 'h3'
import type { TNitroAppInsightsConfig } from './types'
 
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
    };
  }
}

declare module 'nitropack' {
  interface NitroRuntimeHooks {
    'applicationinsights:context:tags': (
      client: TelemetryClient,
      tags: Record<string, string>,
      context: { event: H3Event },
    ) => void;
    'applicationinsights:config': (config: TNitroAppInsightsConfig) => void
    'applicationinsights:trackRequest:before': (event: H3Event, trackObject: Parameters<TelemetryClient['trackRequest']>[0]) => void
  }
}
