import type { NitroModule } from "nitropack"
import { resolve, dirname } from "pathe"
import { fileURLToPath } from "url"

export default <NitroModule>{
    name: 'nitro-applicationinsights',
    setup(nitro) {
        nitro.options.plugins.push(resolve(dirname(fileURLToPath(import.meta.url)), './runtime/plugin'))
    }
}