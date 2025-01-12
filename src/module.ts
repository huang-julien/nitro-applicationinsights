import type { NitroConfig, NitroModule } from 'nitropack'
import { resolvePath } from "mlly"
import defu from 'defu'

export default <NitroModule>{
  name: 'nitro-applicationinsights',
  async setup(nitro) {
    if (!nitro.options.externals) {
      nitro.options.externals = {}
    }
    nitro.options.externals.inline = nitro.options.externals.inline || []
    // force inline the plugin and the setup file
    nitro.options.externals.inline.push((id) => (
      id.includes('nitro-applicationinsights/runtime/plugin')
      || id.includes('nitro-applicationinsights/dist/runtime/plugin')
    ))

    nitro.options.plugins.push(await resolvePath('nitro-applicationinsights/runtime/plugin', {
      extensions: ['.ts', '.mjs', '.js'],
      url: [import.meta.url]
    }))

    nitro.options = defu(nitro.options, {
      imports: {
        presets: [
          {
            package: 'nitro-opentelemetry/runtime/utils.mjs'
          }
        ]
      }
    } as Partial<NitroConfig>);
  }
}
