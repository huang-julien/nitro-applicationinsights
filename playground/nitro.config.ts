import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
  runtimeConfig: {
    applicationinsights: {
      connectionString: 'InstrumentationKey=00000000-0000-0000-0000-000000000000;'
    }
  },

  modules: ['../src/index.ts'],
  compatibilityDate: '2025-01-19'
})