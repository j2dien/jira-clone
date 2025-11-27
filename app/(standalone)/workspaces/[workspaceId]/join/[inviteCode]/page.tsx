import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";

interface WorkspaceIdJoinProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspaceIdJoinPage({
  params,
}: WorkspaceIdJoinProps) {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const { workspaceId } = await params;
  const initialValues = await getWorkspaceInfo({
    workspaceId: workspaceId,
  });

  if (!initialValues) {
    redirect("/");
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm initialValues={initialValues} />
    </div>
  );
}
