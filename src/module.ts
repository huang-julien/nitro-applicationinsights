import { fileURLToPath } from 'node:url'
import type { NitroModule } from 'nitropack'
import { resolve, dirname } from 'pathe'

export default <NitroModule>{
  name: 'nitro-applicationinsights',
  setup (nitro) {
    // this fix the detection of applicationinsights as esm while waiting for mlly 2.0
    if (!nitro.options.experimental?.legacyExternals) {
      if (!nitro.options.experimental) {
        nitro.options.experimental = {}
      }
      nitro.options.experimental.legacyExternals = true
    }
    nitro.options.plugins.push(resolve(dirname(fileURLToPath(import.meta.url)), './runtime/plugin'))
  }
}
