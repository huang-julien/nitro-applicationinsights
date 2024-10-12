import type { NitroConfig, NitroModule } from 'nitropack'
import { resolvePath } from "mlly"
import defu from 'defu'
import MagicString from 'magic-string'
import plugin from './runtime/plugin'

export default <NitroModule>{
  name: 'nitro-applicationinsights',
  async setup(nitro) {
    if (!nitro.options.externals) {
      nitro.options.externals = {}
    }

    nitro.options.alias['#applicationinsights'] = await resolvePath('nitro-applicationinsights/runtime/applicationinsights', {
      extensions: ['.ts', '.mjs', '.js']
    })

    nitro.options.externals.inline = nitro.options.externals.inline || []
    // force inline the plugin and the setup file
    nitro.options.externals.inline.push((id) => (
      id.includes('nitro-applicationinsights/runtime/plugin')
      || id.includes('nitro-applicationinsights/dist/runtime/plugin')
    ))

    nitro.options.externals.traceInclude = nitro.options.externals.traceInclude || []
    // the main file doesn't seems to be traced
    nitro.options.externals.traceInclude.push(await resolvePath('applicationinsights/out/applicationinsights.js'))

    nitro.options.plugins.push(await resolvePath('nitro-applicationinsights/runtime/plugin', {
      extensions: ['.ts', '.mjs', '.js']
    }))

    nitro.options = defu(nitro.options, {
      typescript: {
        tsConfig: {
          compilerOptions: {
            paths: {
              '#applicationinsights': [await resolvePath('nitro-applicationinsights/runtime/applicationinsights', {
                extensions: ['.ts', '.mjs', '.js']
              })]
            }
          }
        }
      },
      rollupConfig: {
        plugins: [
          // add necessary global var for applicationinsights
          {
            name: 'esm-shim',
            renderChunk(code, _chunk, opts) {
              if (code.includes('// transformed by esm-shim')) {
                return
              }
              if (opts.format === 'es') {
                const s = new MagicString(code)
                s.prepend(`
    // transformed by esm-shim
    import { dirname as __pathDirname } from 'path';
    import { fileURLToPath as __fileURLToPath } from 'url';
    const __filename = __fileURLToPath(_import_meta_url_);
    const __dirname = __pathDirname(__filename);`)
                return {
                  code: s.toString(),
                  map: s.generateMap({ hires: true })
                };
              }

              return undefined;
            }
          }
        ]
      }
    } as Partial<NitroConfig>)
  }
}
