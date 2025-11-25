import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { sessionMiddleware } from "@/lib/session-middleware";

import { createWorkspaceSchema } from "../schemas";
import { TablesDB, ID, Client } from "node-appwrite";
import { DATABASE_ID, WORKSPACES_ID } from "@/app/config";

const app = new Hono().post(
  "/",
  zValidator("json", createWorkspaceSchema),
  sessionMiddleware,
  async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { name } = c.req.valid("json");

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const tablesDB = new TablesDB(client);

    const workspace = tablesDB.createRow({
      databaseId: DATABASE_ID,
      tableId: WORKSPACES_ID,
      rowId: ID.unique(),
      data: { name }
    });

    return c.json({ data: workspace })
  }
);

export default app;
