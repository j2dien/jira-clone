import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";

interface ProjectIdPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectIdPage({ params }: ProjectIdPageProps) {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  const { projectId } = await params;

  return <div>ProjectId: {projectId}</div>;
}
