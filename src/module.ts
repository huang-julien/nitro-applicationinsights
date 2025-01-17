import type { NitroConfig, NitroModule } from 'nitropack'
import { resolvePath } from "mlly"
import defu from 'defu'

export default <NitroModule>{
  name: 'nitro-applicationinsights',
  async setup(nitro) {
    nitro.options.externals = defu({
      inline: [
        // force inline the plugin and the setup file
        (id) => (
          id.includes('nitro-applicationinsights/runtime/plugin')
          || id.includes('nitro-applicationinsights/dist/runtime/plugin')
        )
      ], 
    }, nitro.options.externals)
   
    nitro.options.plugins.push(await resolvePath('nitro-applicationinsights/runtime/plugin', {
      extensions: ['.ts', '.mjs', '.js'],
      url: [import.meta.url]
    }))
    nitro.options.plugins.push(await resolvePath('nitro-opentelemetry/runtime/plugin', {
      extensions: ['.ts', '.mjs', '.js'],
      url: [import.meta.url]
    }))

    nitro.options = defu(nitro.options, {
      imports: {
        imports:  [
          {
            from:  await resolvePath('nitro-opentelemetry/runtime/utils', {
              extensions: ['.ts', '.mjs', '.js'],
              url: [import.meta.url]
            }),
          }
        ]
      }
    } as Partial<NitroConfig>);
  }
}
