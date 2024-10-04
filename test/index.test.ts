import { expect, it, describe } from 'vitest'
import { $fetchRaw as $fetch, setup } from 'nitro-test-utils/e2e'
import { dirname } from 'pathe'
import { resolvePathSync } from 'mlly'

const dummyTrace = '00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01'

await setup({
  rootDir: dirname(resolvePathSync('./fixtures/basic/nitro.config.ts', {
    url: import.meta.url
  }))
})

describe('trace', () => {
  it('expect to have the same trace id', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const { data } = await $fetch<{
      trace: string
      initialTrace: string
    }>('/', {
      headers: {
        'traceparent': dummyTrace
      }
    })

    expect(data).toBeDefined()
    expect(data?.initialTrace).toBe(dummyTrace)
    // should have the same op id
    expect(data!.trace.split('-')[1]).toBe(dummyTrace.split('-')[1])
  })

  it('expect error to have the same trace id', async () => {
    const { headers, status } = await $fetch('/error', {
      headers: {
        'traceparent': dummyTrace
      }
    })

    expect(status).toBeGreaterThan(399)
    expect(headers.get('x-trace')?.split('-')[1]).toBe(dummyTrace.split('-')[1])
  })

  it('expect dependency to have the same operation id as the request', async () => {
    const { data } = await $fetch<{
      trace: string
      dependencyTrace: string
    }>('/with-dependency')

    expect(data).toBeDefined()
    expect(data!.dependencyTrace.split('-')[1]).toBe(data!.trace.split('-')[1])
  })
})
