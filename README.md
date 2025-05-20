# Whoa - Remote MCP servers

A remote MCP server based on the [Remote MCP getting started guide](https://developers.cloudflare.com/agents/guides/remote-mcp-server/)

## Build

```bash
npm install
```

```bash
# Update your wrangler.jsonc with the database id
npx wrangler d1 create whoa-storage
```

```bash
npx wrangler d1 migrations apply whoa-storage
```

```bash
npm run dev
```

## Deploy

```bash
npx wrangler d1 migrations apply whoa-storage --remote
npm run deploy
```