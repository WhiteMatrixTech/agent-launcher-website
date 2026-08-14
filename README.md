# Agent Launcher Website

Official bilingual website for [Agent Launcher](https://github.com/WhiteMatrixTech/agent-launcher). The product copy and screenshots are derived from the desktop application's repository.

## Development

```bash
pnpm install
pnpm dev
pnpm build
```

The local server defaults to `http://localhost:4321`.

Astro server-renders the Chinese `/` and English `/en/` routes, while React hydrates the interactive navigation and screenshot tabs. Tailwind CSS v4 is integrated through its Vite plugin.

## Deployment

The site runs as an Astro SSR Worker on Cloudflare. Wrangler targets the `WhiteMatrix` Cloudflare account configured in `wrangler.jsonc`.

```bash
pnpm deploy:dry
pnpm deploy
```

The Worker name is `agent-launcher-homepage`. A custom domain can be attached in Cloudflare after deployment.
