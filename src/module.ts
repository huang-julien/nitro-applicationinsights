import type { NitroModule } from 'nitropack'
import { resolvePath } from "mlly"
import defu from 'defu'
import nitroOtel from "nitro-opentelemetry"

export default <NitroModule>{
  name: 'nitro-applicationinsights',
  async setup(nitro) {
    // applicationinsights with initialize the NodeSDK itself
    nitro.options.otel = defu(nitro.options.otel, {
      preset: false
    } as const)

    await nitroOtel(nitro, undefined)

    nitro.options.externals = defu({
      inline: [
        // force inline the plugin and the setup file
        (id) => (
          id.includes('nitro-applicationinsights/runtime/plugin')
          || id.includes('nitro-applicationinsights/dist/runtime/plugin')
        ),
      ],
    }, nitro.options.externals)

    nitro.options.plugins.push(await resolvePath('nitro-applicationinsights/runtime/plugin', {
      extensions: ['.ts', '.mjs', '.js'],
      url: [import.meta.url]
    }))
  }
}
