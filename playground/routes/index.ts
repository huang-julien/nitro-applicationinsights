import { defineTracedEventHandler } from "nitro-opentelemetry/runtime/utils.mjs"
export default defineTracedEventHandler((e) => {
  return { nitro: 'Is Awesome!' }
})
