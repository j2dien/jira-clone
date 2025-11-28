import { Models } from "node-appwrite";

export enum MemberRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export type Members = Models.Row & {
  userId: string;
  workspaceId: string;
  role: MemberRole;
};
