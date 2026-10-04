import { tasks } from "../state/tasks.js";
import { addTask } from "../actions/addTask.js";
import { deleteTask } from "../actions/deleteTask.js";
import { toggleTask } from "../actions/toggleTask.js";
import { filterTasks } from "../filters/filterTasks.js";
import { validateTask } from "../validation/validateTask.js";
import { renderTasks } from "../render/renderTasks.js";
import { renderStats } from "../render/renderStats.js";

const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector(".task-list");
const feedback = document.querySelector("#taskFeedback");
const filterButtons = document.querySelectorAll(".filter-btn");

const filterValues = [
  "all",
  "pending",
  "completed"
];

let currentFilter = "all";

function updateView() {
  const visibleTasks = filterTasks(tasks, currentFilter);

  renderTasks(
    visibleTasks,
    taskList,
    onToggleTask,
    onDeleteTask
  );

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

function onFilterTasks(filter) {
  currentFilter = filter;

  filterButtons.forEach((button, index) => {
    button.classList.toggle(
      "active",
      filterValues[index] === filter
    );
  });

  updateView();
}

function onToggleTask(taskId) {
  toggleTask(taskId);
  updateView();
  feedback.textContent = "任務完成狀態已切換。";
}

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
