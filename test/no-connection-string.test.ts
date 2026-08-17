import { expect, it, describe } from 'vitest'
import { $fetchRaw as $fetch, setup } from 'nitro-test-utils/e2e'
import { dirname } from 'pathe'
import { resolvePathSync } from 'mlly'

await setup({
  rootDir: dirname(resolvePathSync('./fixtures/no-connection-string/nitro.config.ts', {
    url: import.meta.url
  }))
})

describe('without a connection string', () => {
  it('expect the server to boot and respond without loading the SDK', async () => {
    const { data, status } = await $fetch<{ ok: boolean }>('/')

    expect(status).toBe(200)
    expect(data).toEqual({ ok: true })
  })

  it('expect only the config hook to be called', async () => {
    const { data } = await $fetch<{ hooks: string[] }>('/hooks')

    expect(data!.hooks).toEqual(['config'])
  })
})
