declare module 'h3' {
  interface H3EventContext {
    applicationinsightsHooks?: string[]
  }
}

export default defineNitroPlugin((nitro) => {
  const hooks: string[] = []

  nitro.hooks.hook('applicationinsights:config', (config) => {
    hooks.push(`config:${typeof config.connectionString === 'string'}`)
  })

  nitro.hooks.hook('applicationinsights:setup', ({ client, configuration }) => {
    hooks.push(`setup:${Boolean(client && configuration)}`)
  })

  nitro.hooks.hook('applicationinsights:ready', ({ client }) => {
    hooks.push(`ready:${Boolean(client)}`)
  })

  nitro.hooks.hook('request', (event) => {
    event.context.applicationinsightsHooks = hooks
  })
})
