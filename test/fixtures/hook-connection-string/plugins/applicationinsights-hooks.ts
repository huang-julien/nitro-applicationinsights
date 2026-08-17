declare module 'h3' {
  interface H3EventContext {
    applicationinsightsHooks?: string[]
  }
}

export default defineNitroPlugin((nitro) => {
  const hooks: string[] = []

  // no connection string in the runtime config: inject it through the hook instead
  nitro.hooks.hook('applicationinsights:config', (config) => {
    config.connectionString = 'InstrumentationKey=00000000-0000-0000-0000-000000000000;'
    hooks.push('config')
  })

  nitro.hooks.hook('applicationinsights:setup', () => {
    hooks.push('setup')
  })

  nitro.hooks.hook('applicationinsights:ready', () => {
    hooks.push('ready')
  })

  nitro.hooks.hook('request', (event) => {
    event.context.applicationinsightsHooks = hooks
  })
})
