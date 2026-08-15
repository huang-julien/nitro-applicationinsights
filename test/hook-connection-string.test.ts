import { expect, it, describe } from 'vitest'
import { $fetchRaw as $fetch, setup } from 'nitro-test-utils/e2e'
import { dirname } from 'pathe'
import { resolvePathSync } from 'mlly'

await setup({
  rootDir: dirname(resolvePathSync('./fixtures/hook-connection-string/nitro.config.ts', {
    url: import.meta.url
  }))
})

describe('connection string provided through the applicationinsights:config hook', () => {
  it('expect the SDK to be set up with the injected connection string', async () => {
    const { data } = await $fetch<{ hooks: string[] }>('/hooks')

    expect(data!.hooks).toEqual(['config', 'setup', 'ready'])
  })
})
