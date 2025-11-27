import { Query } from "node-appwrite";

import { getMember } from "@/features/members/utils";

import { createSessionClient } from "@/lib/appwrite";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/app/config";

import { Workspace } from "./types";

export async function getWorkspaces() {
  try {
    const { account, tables } = await createSessionClient();

    const user = await account.get();

    const members = await tables.listRows({
      databaseId: DATABASE_ID,
      tableId: MEMBERS_ID,
      queries: [Query.equal("userId", user.$id)],
    });

    if (members.total === 0) {
      return { rows: [], total: 0 };
    }

    const workspaceIds = members.rows.map((member) => member.workspaceId);

    const workspaces = await tables.listRows({
      databaseId: DATABASE_ID,
      tableId: WORKSPACES_ID,
      queries: [
        Query.orderDesc("$createdAt"),
        Query.contains("$id", workspaceIds),
      ],
    });

    return workspaces;
  } catch {
    return { rows: [], total: 0 };
  }
}

interface GetWorkspaceProps {
  workspaceId: string;
}

export async function getWorkspace({ workspaceId }: GetWorkspaceProps) {
  try {
    const { account, tables } = await createSessionClient();

    const user = await account.get();

    const member = await getMember({
      tables,
      userId: user.$id,
      workspaceId,
    });

    if (!member) {
      return null;
    }

    const workspace = await tables.getRow<Workspace>({
      databaseId: DATABASE_ID,
      tableId: WORKSPACES_ID,
      rowId: workspaceId,
    });

    return workspace;
  } catch {
    return null;
  }
}

interface GetWorkspaceInfoProps {
  workspaceId: string;
}

export async function getWorkspaceInfo({ workspaceId }: GetWorkspaceInfoProps) {
  try {
    const { tables } = await createSessionClient();

    const workspace = await tables.getRow<Workspace>({
      databaseId: DATABASE_ID,
      tableId: WORKSPACES_ID,
      rowId: workspaceId,
    });

    return {
      name: workspace.name,
    };
  } catch {
    return null;
  }
}
