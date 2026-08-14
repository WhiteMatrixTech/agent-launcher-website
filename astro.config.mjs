import cloudflare from '@astrojs/cloudflare'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, sessionDrivers } from 'astro/config'

export default defineConfig({
  site: 'https://agent-launcher-homepage.whitematrix.workers.dev',
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough'
  }),
  session: {
    driver: sessionDrivers.lruCache({ max: 1 })
  },
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
})
