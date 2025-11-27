"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface JoinWorkspaceFormProps {
  initialValues: {
    name: string;
  };
}

export function JoinWorkspaceForm({ initialValues }: JoinWorkspaceFormProps) {
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
      <CardFooter className="px-7 items-center justify-end gap-2">
        <Button variant={"secondary"}>Cancel</Button>
        <Button>Join Workspace</Button>
      </CardFooter>
    </Card>
  );
}
