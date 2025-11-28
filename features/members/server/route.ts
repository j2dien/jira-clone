import { z } from "zod";
import { Hono } from "hono";
import { Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";

import { createAdminClient } from "@/lib/appwrite";
import { DATABASE_ID, MEMBERS_ID } from "@/app/config";
import { sessionMiddleware } from "@/lib/session-middleware";

import { getMember } from "../utils";
import { MemberRole, Members } from "../types";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const { users } = await createAdminClient();
      const tables = c.get("tables");
      const user = c.get("user");
      const { workspaceId } = c.req.valid("query");

      const member = await getMember({
        tables: tables,
        workspaceId: workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const members = await tables.listRows<Members>({
        databaseId: DATABASE_ID,
        tableId: MEMBERS_ID,
        queries: [Query.equal("workspaceId", workspaceId)],
      });

      const populatedMembers = await Promise.all(
        members.rows.map(async (member) => {
          const user = await users.get({ userId: member.userId });

          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        })
      );

      return c.json({
        data: { ...members, rows: populatedMembers },
      });
    }
  )
  .delete("/:memberId", sessionMiddleware, async (c) => {
    const { memberId } = c.req.param();
    const user = c.get("user");
    const tables = c.get("tables");

    const memberToDelete = await tables.getRow<Members>({
      databaseId: DATABASE_ID,
      tableId: MEMBERS_ID,
      rowId: memberId,
    });

    const allMembersInWorkspace = await tables.listRows<Members>({
      databaseId: DATABASE_ID,
      tableId: MEMBERS_ID,
      queries: [Query.equal("workspaceId", memberToDelete.workspaceId)],
    });

    const member = await getMember({
      tables,
      workspaceId: memberToDelete.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (allMembersInWorkspace.total === 1) {
      return c.json({ error: "Cannot delete the only member" }, 401);
    }

    await tables.deleteRow({
      databaseId: DATABASE_ID,
      tableId: MEMBERS_ID,
      rowId: memberId,
    });

    return c.json({ data: { $id: memberToDelete.$id } });
  })
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator("json", z.object({ role: z.enum(MemberRole) })),
    async (c) => {
      const { memberId } = c.req.param();
      const { role } = c.req.valid("json");
      const user = c.get("user");
      const tables = c.get("tables");

      const memberToUpdate = await tables.getRow<Members>({
        databaseId: DATABASE_ID,
        tableId: MEMBERS_ID,
        rowId: memberId,
      });

      const allMembersInWorkspace = await tables.listRows<Members>({
        databaseId: DATABASE_ID,
        tableId: MEMBERS_ID,
        queries: [Query.equal("workspaceId", memberToUpdate.workspaceId)],
      });

      const member = await getMember({
        tables,
        workspaceId: memberToUpdate.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (allMembersInWorkspace.total === 1) {
        return c.json({ error: "Cannot downgrade the only member" }, 401);
      }

      await tables.updateRow({
        databaseId: DATABASE_ID,
        tableId: MEMBERS_ID,
        rowId: memberId,
        data: {
          role: role,
        },
      });

      return c.json({ data: { $id: memberToUpdate.$id } });
    }
  );

export default app;
