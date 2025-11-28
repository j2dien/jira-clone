import { Query, type TablesDB } from "node-appwrite";

import { DATABASE_ID, MEMBERS_ID } from "@/app/config";
import { Members } from "./types";

interface GetMemberProps {
  tables: TablesDB;
  workspaceId: string;
  userId: string;
}

export async function getMember({
  tables,
  workspaceId,
  userId,
}: GetMemberProps) {
  const members = await tables.listRows<Members>({
    databaseId: DATABASE_ID,
    tableId: MEMBERS_ID,
    queries: [
      Query.equal("workspaceId", workspaceId),
      Query.equal("userId", userId),
    ],
  });

  return members.rows[0];
}
