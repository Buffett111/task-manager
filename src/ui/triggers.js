import { tasks } from "../state/tasks.js";
import { addTask } from "../actions/addTask.js";
import { deleteTask } from "../actions/deleteTask.js";
import { validateTask } from "../validation/validateTask.js";
import { renderTasks } from "../render/renderTasks.js";
import { renderStats } from "../render/renderStats.js";

const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector(".task-list");
const feedback = document.querySelector("#taskFeedback");

function updateView() {
  renderTasks(tasks, taskList, onDeleteTask);
  renderStats(tasks);
}

// 事件入口：讀取輸入 → 驗證 → 更新資料 → 更新畫面。
function onAddTask() {
  const title = taskInput.value.trim();

  if (!validateTask(title)) {
    feedback.textContent = "請輸入任務名稱，不能只有空白。";
    taskInput.setAttribute("aria-invalid", "true");
    taskInput.focus();
    return;
  }

  addTask(title);
  updateView();
  taskInput.value = "";
  taskInput.removeAttribute("aria-invalid");
  feedback.textContent = "任務已新增。";
  taskInput.focus();
}

function onFilterTasks(filter) {}

function onToggleTask(taskId) {}

function onDeleteTask(taskId) {
  if (!deleteTask(taskId)) return;

  updateView();
  feedback.textContent = "任務已刪除。";
  taskInput.focus();
}

document.querySelector(".add-btn").addEventListener("click", onAddTask);
document.querySelectorAll(".filter-btn").forEach((button, index) => {
  button.addEventListener("click", () => onFilterTasks(["all", "pending", "completed"][index]));
});

// 初次載入也從 tasks 產生清單，避免 HTML 與資料各存一份任務。
updateView();
