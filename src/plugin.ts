import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin'
import { setup } from './setup'

export default defineNitroPlugin((nitro) => {
  setup()

  nitro.hooks.hook('render:response', (response, { event }) => {
    event.__appInsights.client.trackRequest({
      name: `${event.method}: ${event.path}`,
      url: event.path,
      resultCode: response.statusCode ?? 0,
      duration: Date.now() - event.__appInsights.startTime,
      success: response.statusCode ? response.statusCode < 400 : false,
      properties: event.__appInsights.properties,
      contextObjects: {
        ...event.__appInsights.client.context.tags,
        // needed ?
        // [event.__appInsights.client.context.keys.operationId]: event.__appInsights.trace.traceId,
        [event.__appInsights.client.context.keys.operationParentId]:
          event.__appInsights.trace.parentId
      },
      id: event.__appInsights.trace.traceId
    })
  })
})
