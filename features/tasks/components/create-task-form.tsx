"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { createTaskSchema } from "../schemas";
import { useCreateTask } from "../api/use-create-task";

interface CreateTaskFormProps {
  onCancel?: () => void;
  projecOptions: { id: string; name: string; imageUrl: string }[];
  membertions: { id: string; name: string }[];
}

export function CreateTaskForm({
  onCancel,
  projecOptions,
  membertions,
}: CreateTaskFormProps) {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { mutate, isPending } = useCreateTask();

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema.omit({ workspaceId: true })),
    defaultValues: {
      workspaceId,
    },
  });

  const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
    mutate(
      { json: { ...values, workspaceId } },
      {
        onSuccess: () => {
          form.reset();
          // TODO: Redirect to new task
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Create a new task</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <form
          id="form-create-task"
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-create-task-name">
                    Task Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-create-task-name"
                    aria-invalid={fieldState.invalid}
                    type="text"
                    placeholder="Enter task name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="dueDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-create-task-dueDate">
                    Due Date
                  </FieldLabel>
                  {/* TODO: Date Picker */}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardFooter className="flex items-center justify-end gap-2">
        <Button
          type="button"
          size={"lg"}
          variant={"secondary"}
          onClick={onCancel}
          disabled={isPending}
          className={cn(!onCancel && "invisible")}
        >
          Cancel
        </Button>
        <Button size={"lg"} form="form-create-task" disabled={isPending}>
          Create Task
        </Button>
      </CardFooter>
    </Card>
  );
}
