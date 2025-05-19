import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { env } from "cloudflare:workers";

type State = {};
type Props = {
  username: string;
};

// Define our MCP agent with tools

export class MyMCP extends McpAgent<Env, State, Props> {
  server = new McpServer({
    name: "Authless Whoa",
    version: "1.0.0",
  });

  async init() {
    this.server.tool("whoAmI", {}, async () => {
      return {
        content: [
          {
            type: "text",
            text: `Your username is ${this.props.username}`,
          },
        ],
      };
    });
    this.server.tool(
      "trackWhoa",
      {
        reason: z
          .string({
            description:
              "Summary of the context why the user responded with whoa",
          })
          .default("Probably some AI stuff"),
      },
      async ({ reason }) => {
        await env.DB.prepare(
          `INSERT INTO whoas (username, whoa_reason) VALUES (?, ?)`
        )
          .bind(this.props.username, reason)
          .run();
        return {
          content: [
            {
              type: "text",
              text: `${this.props.username} said whoa and it was tracked`,
            },
          ],
        };
      }
    );

    this.server.tool(
      "reportWhoaCount",
      {
        username: z
          .string({ description: "User that we should count the whoas for" })
          .default(this.props.username),
      },
      async ({ username }) => {
        const { results } = await env.DB.prepare(
          `SELECT count(*) AS whoa_count FROM whoas WHERE username=?`
        )
          .bind(username)
          .all();
        return {
          content: [
            {
              type: "text",
              text: `${username} said whoa ${results[0].whoa_count} times`,
            },
          ],
        };
      }
    );
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    const username = request.headers.get("x-whoa-username");
    if (!username) {
      return new Response("Whoa there, missing X-Whoa-Username header", {
        status: 401,
      });
    }

    ctx.props = {
      username: username.toLowerCase(),
    };

    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
      // @ts-ignore
      return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
    }

    if (url.pathname === "/mcp") {
      // @ts-ignore
      return MyMCP.serve("/mcp").fetch(request, env, ctx);
    }

    return new Response("Not found", { status: 404 });
  },
};
