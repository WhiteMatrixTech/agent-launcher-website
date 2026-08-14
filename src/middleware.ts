import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next()
  const headers = new Headers(response.headers)

  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  if (headers.get('Content-Type')?.includes('text/html')) {
    headers.set('Cache-Control', 'no-store, must-revalidate')
    headers.set('X-Render-Mode', 'ssr')
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  })
})
