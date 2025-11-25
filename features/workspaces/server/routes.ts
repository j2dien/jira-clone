import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { sessionMiddleware } from "@/lib/session-middleware";

import { createWorkspaceSchema } from "../schemas";
import { ID } from "node-appwrite";
import { DATABASE_ID, WORKSPACES_ID } from "@/app/config";

const app = new Hono().post(
  "/",
  zValidator("json", createWorkspaceSchema),
  sessionMiddleware,
  async (c) => {
    const tables = c.get("tables");
    const user = c.get("user");

    const { name } = c.req.valid("json");

    const workspace = await tables.createRow({
      databaseId: DATABASE_ID,
      tableId: WORKSPACES_ID,
      rowId: ID.unique(),
      data: {
        name,
        userId: user.$id,
      },
    });

    return c.json({ data: workspace });
  }
);

export default app;
