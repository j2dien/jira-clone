"use client"

import { ResponsiveModal } from "@/components/responsive-modal";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";

export function CreateTaskModal() {
  const { isOpen, setIsOpen } = useCreateTaskModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <div>TODO: Task form</div>
    </ResponsiveModal>
  );
}
