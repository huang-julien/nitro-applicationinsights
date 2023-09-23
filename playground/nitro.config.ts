import { defineNitroConfig } from "nitropack/config"

export default defineNitroConfig({
    plugins: [
        "../src/plugin"
    ],
    srcDir: "./src"
})