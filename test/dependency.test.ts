import { expect, it, describe, vi } from 'vitest'
import { $fetchRaw as $fetch, setup } from 'nitro-test-utils/e2e'
import { dirname } from 'pathe'
import { resolvePathSync } from 'mlly'
import { SpanKind } from '@opentelemetry/api'

// regression test for #289: outbound fetch/undici calls must produce client
// spans on the tracer provider registered by applicationinsights

await setup({
  rootDir: dirname(resolvePathSync('./fixtures/dependency/nitro.config.ts', {
    url: import.meta.url
  }))
})

describe('dependency telemetry', () => {
  it('records outbound fetch calls on the applicationinsights tracer provider', { timeout: 15_000 }, async () => {
    const { data } = await $fetch<{ upstream: string }>('/dep')

    expect(data?.upstream).toBe('pong')

    await vi.waitFor(async () => {
      const { data: spans } = await $fetch<{
        name: string
        kind: SpanKind
        attributes: Record<string, unknown>
      }[]>('/spans')

      const dependencySpan = spans?.find(span =>
        span.kind === SpanKind.CLIENT
        && Object.values(span.attributes).some(value => String(value).includes('/pong'))
      )
      expect(dependencySpan, 'no client span recorded for the outbound fetch').toBeDefined()
    }, { timeout: 10_000, interval: 250 })
  })
})
