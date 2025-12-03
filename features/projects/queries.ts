import { getMember } from "@/features/members/utils";

import { createSessionClient } from "@/lib/appwrite";
import { DATABASE_ID, PROJECTS_ID } from "@/app/config";
import { Project } from "./types";

interface GetProjectProps {
  projectId: string;
}

export async function getProject({ projectId }: GetProjectProps) {
  const { account, tables } = await createSessionClient();

  const user = await account.get();

  const project = await tables.getRow<Project>({
    databaseId: DATABASE_ID,
    tableId: PROJECTS_ID,
    rowId: projectId,
  });

  const member = await getMember({
    tables,
    userId: user.$id,
    workspaceId: project.workspaceId,
  });

  if (!member) {
    throw new Error("Unauthorized");
  }

  return project;
}
