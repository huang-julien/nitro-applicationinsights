import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
  plugins: [
    '../dist/index.mjs'
  ]
})
