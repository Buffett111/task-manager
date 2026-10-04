import { tasks } from "../state/tasks.js";

export function toggleTask(taskId) {
  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return;
  }

  task.completed = !task.completed;
}