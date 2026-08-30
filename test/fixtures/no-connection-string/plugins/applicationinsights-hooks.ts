declare module 'h3' {
  interface H3EventContext {
    applicationinsightsHooks?: string[]
  }
}

export default defineNitroPlugin((nitro) => {
  const hooks: string[] = []

  nitro.hooks.hook('applicationinsights:config', () => {
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
