import { Models } from "node-appwrite";
import { Project } from "../projects/types";

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export type Assignee = Models.Row & {
    name: string;
    email: string;
  };

export type Task = Models.Row & {
  project?: Project;
  assignee?: Assignee;
  workspaceId: string;
  name: string;
  projectId: string;
  assigneeId: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  position: number;
};
