// 只依傳入資料建立畫面，不在這裡新增或刪除任務資料。
export function renderTasks(
  tasks,
  listElement,
  onToggleTask,
  onDeleteTask
) {
  listElement.replaceChildren();

  tasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = task.completed ? "task-item completed" : "task-item";
    item.dataset.taskId = task.id;

    const content = document.createElement("div");
    content.className = "task-content";

    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.setAttribute(
      "aria-label",
      `切換完成狀態：${task.title}`
    );

    checkbox.addEventListener("change", () => {
      onToggleTask(task.id);
    });

    const title = document.createElement("span");
    title.textContent = task.title; // 將輸入當成文字，避免被解析成 HTML。

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "刪除";
    deleteButton.setAttribute("aria-label", `刪除任務：${task.title}`);
    deleteButton.addEventListener("click", () => onDeleteTask(task.id));

    content.append(checkbox, title);
    item.append(content, deleteButton);
    listElement.append(item);
  });
}
