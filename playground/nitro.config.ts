import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
  runtimeConfig: {
    applicationinsights: {
      connectionString: 'InstrumentationKey=f629321d-170e-4630-85d3-09908821ab5a;IngestionEndpoint=https://francecentral-1.in.applicationinsights.azure.com/;LiveEndpoint=https://francecentral.livediagnostics.monitor.azure.com/;ApplicationId=e970c659-1858-4040-b255-aac514ea70e8'
    }
  },  modules: ['../src/index.ts']
})
