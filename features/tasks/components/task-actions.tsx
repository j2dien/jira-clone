import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";

import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useDeleteTask } from "../api/use-delete-task";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

interface TaskActionsProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
}

export function TaskActions({ id, projectId, children }: TaskActionsProps) {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Task",
    "This action cannot be undone.",
    "destructive"
  );
  const { mutate, isPending } = useDeleteTask();

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate({ param: { taskId: id } });
  };

  const onOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
  };

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto">
          <DropdownMenuItem onClick={onOpenTask} className="font-medium p-2.5">
            <ExternalLinkIcon className="size-4 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onOpenProject}
            className="font-medium p-2.5"
          >
            <ExternalLinkIcon className="size-4 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {}} className="font-medium p-2.5">
            <PencilIcon className="size-4 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isPending}
            className="text-amber-700 focus:text-amber-700 font-medium p-2.5"
          >
            <TrashIcon className="size-4 stroke-2 text-amber-700 focus:text-amber-700" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
