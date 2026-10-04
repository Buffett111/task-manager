import { tasks } from "../state/tasks.js";

let nextTaskId = Math.max(0, ...tasks.map((task) => task.id)) + 1;

// 接收已驗證的名稱，只處理資料，不操作 HTML。
export function addTask(title) {
  const task = { id: nextTaskId++, title, completed: false };
  tasks.push(task);
  return task;
}
