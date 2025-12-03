"use client";

import { z } from "zod";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeftIcon, ImageIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";
import {
  Card,
  CardContent,
  CardDescription,
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

import { Project } from "@/features/projects/types";
import { updateProjectSchema } from "../schemas";
import { useUpdateProject } from "../api/use-update-project";
import { useDeleteProject } from "@/features/projects/api/use-delete-project";

interface EditProjectFormProps {
  onCancel?: () => void;
  initialValues: Project;
}

export function EditProjectForm({
  onCancel,
  initialValues,
}: EditProjectFormProps) {
  const router = useRouter();
  const { mutate, isPending } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeletingProject } =
    useDeleteProject();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Workspace",
    "This action cannot be undone",
    "destructive"
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
  });

  const handleDelete = async () => {
    const ok = await confirmDelete();

    if (!ok) return;

    deleteProject(
      {
        param: { projectId: initialValues.$id },
      },
      {
        onSuccess: () => {
          router.push(`/workspaces/${initialValues.workspaceId}`);
        },
      }
    );
  };

  const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    mutate(
      { form: finalValues, param: { projectId: initialValues.$id } },
      {
        onSuccess: (values) => {
          form.reset({
            name: values.data.name,
            image: values.data.imageUrl ?? "",
          });
        },
      }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  return (
    <>
      <DeleteDialog />
      <div className="flex flex-col gap-y-4">
        <Card className="w-full h-full border-none shadow-none ">
          <CardHeader className="flex flex-row items-center gap-x-4 px-7 space-y-0">
            <Button
              size={"sm"}
              variant={"secondary"}
              onClick={
                onCancel
                  ? onCancel
                  : () =>
                      router.push(
                        `/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`
                      )
              }
            >
              <ArrowLeftIcon className="size-4" />
              Back
            </Button>
            <CardTitle className="text-xl font-bold">
              {initialValues.name}
            </CardTitle>
          </CardHeader>
          <div className="px-7">
            <DottedSeparator />
          </div>
          <CardContent className="p-7">
            <form
              id="form-create-project"
              className="space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-create-project-name">
                        Project Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-create-project-name"
                        aria-invalid={fieldState.invalid}
                        type="text"
                        placeholder="Enter project name"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="image"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex flex-col gap-y-2">
                        <div className="flex items-center gap-x-5">
                          {field.value ? (
                            <div className="size-[72px] relative rounded-md overflow-hidden">
                              <Image
                                alt="Logo"
                                fill
                                className="object-cover"
                                src={
                                  field.value instanceof File
                                    ? URL.createObjectURL(field.value)
                                    : field.value
                                }
                              />
                            </div>
                          ) : (
                            <Avatar className="size-[72px]">
                              <AvatarFallback>
                                <ImageIcon className="size-9 text-neutral-400" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className="flex flex-col">
                            <p>Project Icon</p>
                            <p className="text-sm text-muted-foreground">
                              JPG, PNG, SVG or JPEG, max 1mb
                            </p>
                            <input
                              className="hidden"
                              type="file"
                              ref={inputRef}
                              onChange={handleImageChange}
                              disabled={isPending}
                            />
                            {field.value ? (
                              <Button
                                type="button"
                                disabled={isPending}
                                variant={"destructive"}
                                size={"xs"}
                                className="w-fit mt-2"
                                onClick={() => {
                                  field.onChange(null);
                                  if (inputRef.current) {
                                    inputRef.current.value = "";
                                  }
                                }}
                              >
                                Remove Image
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                disabled={isPending}
                                variant={"teritary"}
                                size={"xs"}
                                className="w-fit mt-2"
                                onClick={() => inputRef.current?.click()}
                              >
                                Upload Image
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
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
            <Button size={"lg"} form="form-create-project" disabled={isPending}>
              Save Changes
            </Button>
          </CardFooter>
        </Card>

        <Card className="w-full h-full border-none shadow-none">
          <CardHeader className="px-7">
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>
              Deleting a project is irreversible and will remove all associated
              data
            </CardDescription>
          </CardHeader>
          <DottedSeparator className="px-7" />
          <CardFooter className="px-7">
            <Button
              className="mt-6 w-fit ml-auto"
              size={"sm"}
              variant={"destructive"}
              type="button"
              disabled={isPending || isDeletingProject}
              onClick={handleDelete}
            >
              Delete Project
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
