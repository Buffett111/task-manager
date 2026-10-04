export function filterTasks(tasks, filter) {
  if (filter === "pending") {
    return tasks.filter((task) => !task.completed);
  }

  if (filter === "completed") {
    return tasks.filter((task) => task.completed);
  }
  if (filter === "all") {
    return tasks;
  }

  return tasks;
}