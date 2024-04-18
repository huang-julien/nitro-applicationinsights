import type { NitroModule } from 'nitropack'
import { resolvePath } from "mlly"
export default <NitroModule>{
  name: 'nitro-applicationinsights',
  async setup(nitro) {
    if (!nitro.options.externals) {
      nitro.options.externals = {}
    }

    // needed to not inline applicationinsights until mlly 2.0
    if (!nitro.options.experimental) {
      nitro.options.experimental = {}
    }
    nitro.options.experimental.legacyExternals = true

    nitro.options.externals.inline = nitro.options.externals.inline || []
    // force inline the plugin and the setup file
    nitro.options.externals.inline.push((id) => (
      id.includes('nitro-applicationinsights/runtime/plugin')
      || id.includes('nitro-applicationinsights/dist/runtime/plugin')
      || id.includes('nitro-applicationinsights/runtime/setup')
      || id.includes('nitro-applicationinsights/dist/runtime/setup')
    ))

    nitro.options.externals.traceInclude = nitro.options.externals.traceInclude || []

    // the main file doesn't seems to be traced
    nitro.options.externals.traceInclude.push(await resolvePath('applicationinsights/out/applicationinsights.js'))

    nitro.options.plugins.push(await resolvePath('nitro-applicationinsights/runtime/plugin', {
      extensions: ['.ts', '.mjs', '.js']
    }))
  }
}
