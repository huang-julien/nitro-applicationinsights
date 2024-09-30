import type { TelemetryClient, Contracts } from 'applicationinsights'
import type Traceparent from 'applicationinsights/out/Library/Traceparent'
import type { H3Event } from 'h3'
import type { TNitroAppInsightsConfig } from './types'
import { CapturedErrorContext, NitroConfig } from 'nitropack';
 
declare module 'h3' {
  interface H3Event {
    $appInsights: {
      startTime: number;
      client: TelemetryClient;
      trace: Traceparent;
      initialTrace: string;
      /**
       * @deprecated use requestTelemetry.properties
       */
      properties: Record<string, string>;
      /**
       * set false to disable tracking for this request
       */
      shouldTrack: boolean
      /**
       * @deprecated use requestTelemetry.contextObject
       */
      tags: Record<string, string|undefined>
      requestTelemetry: Contracts.RequestTelemetry & Contracts.Identified
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
    // todo add type augmentation to context
    'applicationinsights:trackError:before': (exceptionTelemtry: Contracts.ExceptionTelemetry, context: CapturedErrorContext) => void
  }

  interface NitroRuntimeConfig {
    applicationinsights?: TNitroAppInsightsConfig
  }
}

declare module 'nitropack/config' {
  function defineNitroConfig(config: NitroConfig & {
      runtimeConfig: {
        applicationinsights?: TNitroAppInsightsConfig
      }
    }): NitroConfig;
}