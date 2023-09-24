import { defineEventHandler, getHeader, getCookie } from 'h3'
import Traceparent from 'applicationinsights/out/Library/Traceparent'
import TelemetryClient from 'applicationinsights/out/Library/NodeClient'
import { useNitroApp } from 'nitropack/dist/runtime/app'

export default defineEventHandler(async (event) => {
  const nitro = useNitroApp()
  const traceParent = getHeader(event, 'Traceparent')

  const trace = new Traceparent(traceParent)
  const client = new TelemetryClient()

  // context should contain Contract tags
  client.addTelemetryProcessor((envelope, context) => {
    if (context) {
      for (const [key, val] of Object.entries(context)) {
        envelope.tags[key] = val
      }
    }
    return true
  })

  // initial traceId for this request
  trace.updateSpanId()

  // TODO get cookies list
  const aiUser = getCookie(event, 'ai_user')
  const aiSession = getCookie(event, 'ai_session')
  const aiDevice = getCookie(event, 'ai_device')

  Object.assign(client.context.tags, {
    [client.context.keys.sessionId]: aiSession,
    [client.context.keys.userId]: aiUser,
    [client.context.keys.deviceId]: aiDevice
  })

  await nitro.hooks.callHook(
    'applicationinsights:context:tags',
    client,
    client.context.tags,
    { event }
  )

  event.__appInsights = {
    startTime: Date.now(),
    client,
    initialTrace: traceParent ?? trace.toString(),
    trace,
    properties: {}
  }
})
