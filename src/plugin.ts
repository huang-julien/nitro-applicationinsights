import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin'
import { setup } from './setup'
import middleware from './middleware'

export default defineNitroPlugin((nitro) => {
  setup()

  nitro.h3App.use(middleware)

  nitro.hooks.hook('render:response', (response, { event }) => {
    event.$appInsights.client.trackRequest({
      name: `${event.method}: ${event.path}`,
      url: event.path,
      resultCode: response.statusCode ?? 0,
      duration: Date.now() - event.$appInsights.startTime,
      success: response.statusCode ? response.statusCode < 400 : false,
      properties: event.$appInsights.properties,
      contextObjects: {
        ...event.$appInsights.client.context.tags,
        // needed ?
        // [event.__appInsights.client.context.keys.operationId]: event.__appInsights.trace.traceId,
        [event.$appInsights.client.context.keys.operationParentId]:
          event.$appInsights.trace.parentId
      },
      id: event.$appInsights.trace.traceId
    })
  })
})
