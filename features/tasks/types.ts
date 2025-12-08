import { Models } from "node-appwrite";
import { Project } from "../projects/types";
import { Member } from "../members/types";

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

type Assignee = Models.Row & Member & {
  name: string;
  email: string;
}

export type Task = Models.Row & {
  project: Project | undefined;
  assignee: Assignee | undefined;
  workspaceId: string;
  name: string;
  projectId: string;
  assigneeId: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  position: number;
};
