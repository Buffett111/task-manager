export function renderStats(tasks) {
  const completedCount = tasks.filter((task) => task.completed).length;
  document.querySelector("#totalCount").textContent = tasks.length;
  document.querySelector("#pendingCount").textContent = tasks.length - completedCount;
  document.querySelector("#completedCount").textContent = completedCount;
}
