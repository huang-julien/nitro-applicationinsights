import { defineConfig } from 'nitro-test-utils/config'

const rootDir = new URL('fixtures/basic', import.meta.url).pathname

export default defineConfig({
    nitro: {
        rootDir 
    }
})