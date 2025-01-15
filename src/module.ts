import type { NitroModule } from 'nitropack'
import { resolvePath } from "mlly"
import defu from 'defu'
import { NitroOptions } from 'nitropack/types'

export default <NitroModule>{
  name: 'nitro-applicationinsights',
  async setup(nitro) {
    nitro.options = defu(nitro.options, {
      externals: {
        inline: [
          // force inline the plugin and the setup file
          (id) => (
            id.includes('nitro-applicationinsights/runtime/plugin')
            || id.includes('nitro-applicationinsights/dist/runtime/plugin')
          )
        ]
      },
      
      plugins: [
        await resolvePath('nitro-applicationinsights/runtime/plugin', {
          extensions: ['.ts', '.mjs', '.js'],
          url: [import.meta.url]
        })
      ],

      imports: {
        presets: [
          {
            package: 'nitro-opentelemetry/runtime/utils.mjs'
          }
        ]
      }
    } as Partial<NitroOptions>)
  }
}
