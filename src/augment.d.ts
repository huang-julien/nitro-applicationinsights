import type { TNitroAppInsightsConfig } from './types'
import { NitroConfig } from 'nitropack';

declare module 'nitropack' {
  interface NitroRuntimeHooks {
    'applicationinsights:config': (config: TNitroAppInsightsConfig) => void
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