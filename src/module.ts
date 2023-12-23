import { fileURLToPath } from 'node:url'
import type { NitroModule } from 'nitropack'
import { resolve, dirname } from 'pathe'

export default <NitroModule>{
  name: 'nitro-applicationinsights',
  setup (nitro) {
    nitro.options.plugins.push(resolve(dirname(fileURLToPath(import.meta.url)), './runtime/plugin'))
  }
}
