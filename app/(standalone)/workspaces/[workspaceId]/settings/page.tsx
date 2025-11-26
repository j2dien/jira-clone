import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import { getWorkspace } from "@/features/workspaces/queries";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";

interface WorkspaceIdSettingsPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspaceIdSettingsPage({
  params,
}: WorkspaceIdSettingsPageProps) {
  const { workspaceId } = await params;
  const user = getCurrent();
  if (!user) redirect("/sign-in");

  const initialValues = await getWorkspace({ workspaceId: workspaceId });

  if (!initialValues) {
    redirect(`/workspaces/${workspaceId}`);
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={initialValues} />
    </div>
  );
}
