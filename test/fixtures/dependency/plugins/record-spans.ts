import type { ReadableSpan } from '@opentelemetry/sdk-trace-node'


export default defineNitroPlugin((nitro) => {
  const spans: ReadableSpan[] = []
  // @ts-expect-error test-only global, read by routes/spans.ts
  globalThis.__recordedSpans = spans

  nitro.hooks.hook('applicationinsights:setup', ({ client }) => {
    client.config.azureMonitorOpenTelemetryOptions = {
      spanProcessors: [{
        forceFlush: () => Promise.resolve(),
        onStart: () => {},
        onEnd: span => { spans.push(span) },
        shutdown: () => Promise.resolve(),
      }],
    }
  })
})
