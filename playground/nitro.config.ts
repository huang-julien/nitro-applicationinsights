import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
  runtimeConfig: {
    applicationinsights: {
      connectionString: 'InstrumentationKey=00000000-0000-0000-0000-000000000000;'
    }
  },  modules: ['../src/index.ts']
})
