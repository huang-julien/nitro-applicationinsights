export default defineEventHandler(async (event) => {
  // real outbound HTTP request through undici's fetch, back to our own server
  const res = await fetch(new URL('/pong', getRequestURL(event)))
  return { upstream: await res.text() }
})
