export default defineEventHandler((event) => {
  return { hooks: event.context.applicationinsightsHooks ?? [] }
})
