import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { sessionMiddleware } from "@/lib/session-middleware";

import { createWorkspaceSchema } from "../schemas";
import { TablesDB } from "node-appwrite";

const app = new Hono().post(
  "/",
  zValidator("json", createWorkspaceSchema),
  sessionMiddleware,
  async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { name } = c.req.valid("json");

    const workspace = await databases;
  }
);

export default app;
