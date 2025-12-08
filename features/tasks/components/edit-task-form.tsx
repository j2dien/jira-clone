"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/date-picker";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Task, TaskStatus } from "../types";
import { createTaskSchema } from "../schemas";
import { useUpdateTask } from "../api/use-update-task";
import { Textarea } from "@/components/ui/textarea";

interface EditTaskFormProps {
  onCancel?: () => void;
  projecOptions: { id: string; name: string; imageUrl: string }[];
  membertions: { id: string; name: string }[];
  initialValues: Task;
}

export function EditTaskForm({
  onCancel,
  projecOptions,
  membertions,
  initialValues,
}: EditTaskFormProps) {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { mutate, isPending } = useUpdateTask();

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(
      createTaskSchema.omit({ workspaceId: true, description: true })
    ),
    defaultValues: {
      ...initialValues,
      dueDate: initialValues.dueDate
        ? new Date(initialValues.dueDate)
        : undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
    mutate(
      { json: values, param: { taskId: initialValues.$id } },
      {
        onSuccess: () => {
          form.reset();
          onCancel?.();
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex px-7">
        <CardTitle className="text-xl font-bold">Edit a task</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="px-7 py-4">
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
                  <DatePicker id="form-create-task-dueDate" {...field} />
                </Field>
              )}
            />
            <Controller
              name="assigneeId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-create-task-assigneeId">
                    Assignee
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="form-create-task-assigneeId">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                    <SelectContent>
                      {membertions.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center gap-x-2">
                            <MemberAvatar
                              className="size-6"
                              name={member.name}
                            />
                            <p>{member.name}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-create-task-status">
                    Status
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="form-create-task-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                    <SelectContent>
                      <SelectItem value={TaskStatus.BACKLOG}>
                        Backlog
                      </SelectItem>
                      <SelectItem value={TaskStatus.IN_PROGRESS}>
                        In Progress
                      </SelectItem>
                      <SelectItem value={TaskStatus.IN_REVIEW}>
                        In Review
                      </SelectItem>
                      <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
                      <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <Controller
              name="projectId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-create-task-projectId">
                    Project
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="form-create-task-projectId">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                    <SelectContent>
                      {projecOptions.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          <div className="flex items-center gap-x-2">
                            <ProjectAvatar
                              className="size-6"
                              name={project.name}
                              image={project.imageUrl}
                            />
                            <p>{project.name}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-create-task-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="form-create-task-description"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter task description"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
        <Button
          type="submit"
          size={"lg"}
          form="form-create-task"
          disabled={isPending}
        >
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
