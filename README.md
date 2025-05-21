# Whoa - Remote MCP server

[<img src="https://img.youtube.com/vi/WN0XlBcE1P8/0.jpg">](https://youtu.be/WN0XlBcE1P8 "Use the new OpenAI MCP Tool in the Responses API")

A remote MCP server based on the [Remote MCP getting started guide](https://developers.cloudflare.com/agents/guides/remote-mcp-server/)

Tracks and reports on the word whoa.

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