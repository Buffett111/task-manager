import { tasks } from "../state/tasks.js";

export function deleteTask(taskId) {
  const index = tasks.findIndex((task) => task.id === taskId);
  // 找不到時不要使用 splice(-1, 1)，否則會誤刪最後一筆。
  if (index === -1) return false;

  // 原地修改陣列，保留其他模組持有的 tasks 參照。
  tasks.splice(index, 1);
  return true;
}
