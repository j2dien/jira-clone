import { useParams } from "next/navigation";

export default function useTaskId() {
  const params = useParams();
  return params.taskId as string;
}
