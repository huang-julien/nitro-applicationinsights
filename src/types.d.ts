import type { TelemetryClient } from "applicationinsights";
import type Traceparent from "applicationinsights/out/Library/Traceparent";
import type { H3Event } from "h3";

declare module "h3" {
  interface H3Event {
    __appInsights: {
      startTime: number;
      client: TelemetryClient;
      trace: Traceparent;
      initialTrace: string;
      properties: Record<string, string>;
    };
  }
}

declare module "nitropack/dist/runtime/types.d.ts" {
  interface NitroRuntimeHooks {
    "applicationinsights:context:tags": (
      client: TelemetryClient,
      tags: Record<string, string>,
      context: { event: H3Event },
    ) => void;
  }
}
