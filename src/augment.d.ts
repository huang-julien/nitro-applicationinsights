import type { TNitroAppInsightsConfig } from './types'
import { NitroConfig } from 'nitropack';
import type { Configuration, TelemetryClient } from 'applicationinsights';
declare module 'nitropack' {
  interface NitroRuntimeHooks {
    /**
     * @deprecated since 1.1.0 prefer using applicationinsights:setup hook and modify the configuration object
     */
    'applicationinsights:config': (config: TNitroAppInsightsConfig) => void
    /**
     * Triggered when the applicationinsights client is setup but not started
     * If you want to modify azure monitors options you can do it here
     */
    'applicationinsights:setup': (context: { client: TelemetryClient, configuration: Configuration }) => void
    /**
     * Triggered when the applicationinsights client is ready and initialized
     */
    'applicationinsights:ready': (context: { client: TelemetryClient }) => void
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