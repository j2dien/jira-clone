"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useInviteCode } from "@/features/workspaces/hooks/use-invite-code";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useJoinWorkspace } from "@/features/workspaces/api/use-join-workspace";

interface JoinWorkspaceFormProps {
  initialValues: {
    name: string;
  };
}

export function JoinWorkspaceForm({ initialValues }: JoinWorkspaceFormProps) {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const inviteCode = useInviteCode();
  const { mutate, isPending } = useJoinWorkspace();

  const onSubmit = () => {
    mutate(
      {
        param: { workspaceId },
        json: { code: inviteCode },
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="px-7">
        <CardTitle className="text-xl font-bold">Join workspace</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join{" "}
          <strong>{initialValues.name} workspace</strong>
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardFooter className="px-7 flex flex-col lg:flex-row items-center justify-end gap-2">
        <Button
          variant={"secondary"}
          type="button"
          className="w-full lg:w-fit"
          size={"lg"}
          asChild
          disabled={isPending}
        >
          <Link href="/">Cancel</Link>
        </Button>
        <Button
          className="w-full lg:w-fit"
          type="button"
          size={"lg"}
          onClick={onSubmit}
          disabled={isPending}
        >
          Join Workspace
        </Button>
      </CardFooter>
    </Card>
  );
}
