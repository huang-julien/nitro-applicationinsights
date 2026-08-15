import type { ReadableSpan } from '@opentelemetry/sdk-trace-node'

export default defineEventHandler(() => {
  // @ts-expect-error test-only global, set by plugins/record-spans.ts
  const spans = (globalThis.__recordedSpans ?? []) as ReadableSpan[]
  return spans.map(span => ({
    name: span.name,
    kind: span.kind,
    attributes: span.attributes,
  }))
})
