import test, { beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { tasks } from "../src/state/tasks.js";
import { addTask } from "../src/actions/addTask.js";
import { toggleTask } from "../src/actions/toggleTask.js";
import { deleteTask } from "../src/actions/deleteTask.js";
import { validateTask } from "../src/validation/validateTask.js";

// Keep the exported array reference intact, and restore the original fixtures
// between tests. The production ID counter intentionally remains monotonic.
const initialTasks = structuredClone(tasks);
const restoreTasks = () => tasks.splice(0, tasks.length, ...structuredClone(initialTasks));
beforeEach(restoreTasks);
afterEach(restoreTasks);

test("add: appends an incomplete task and preserves the exported array", () => {
  const reference = tasks;
  const count = tasks.length;
  const created = addTask("完成自動測試");

  assert.equal(tasks, reference);
  assert.equal(tasks.length, count + 1);
  assert.equal(tasks.at(-1), created);
  assert.equal(created.title, "完成自動測試");
  assert.equal(created.completed, false);
});

test("add: identical titles receive different IDs", () => {
  const first = addTask("同名任務");
  const second = addTask("同名任務");
  assert.notEqual(first.id, second.id);
  assert.equal(new Set(tasks.map((task) => task.id)).size, tasks.length);
});

test("add contract: caller trims a validated title before adding it", () => {
  // The browser event handler owns trimming; addTask accepts an already
  // validated title. Browser tests verify that actual event wiring separately.
  const rawInput = "  撰寫成果報告 \t";
  assert.equal(validateTask(rawInput), true);
  const created = addTask(rawInput.trim());
  assert.equal(created.title, "撰寫成果報告");
});

test("add: preserves Chinese, emoji and HTML-like text as task data", () => {
  const title = '中文 ✅ <img src=x onerror="alert(1)">';
  assert.equal(addTask(title).title, title);
});

test("toggle: completing and reopening changes only the selected task", () => {
  const task = tasks.find((item) => !item.completed);
  const otherTasks = structuredClone(tasks.filter((item) => item.id !== task.id));
  toggleTask(task.id);
  assert.equal(task.completed, true);
  toggleTask(task.id);
  assert.equal(task.completed, false);
  assert.deepEqual(tasks.filter((item) => item.id !== task.id), otherTasks);
});

test("toggle: an unknown ID leaves all tasks unchanged", () => {
  const before = structuredClone(tasks);
  toggleTask(-999);
  assert.deepEqual(tasks, before);
});

test("delete: removes only the requested task and preserves the array", () => {
  const reference = tasks;
  const target = tasks[1];
  const expected = structuredClone(tasks.filter((task) => task.id !== target.id));
  assert.equal(deleteTask(target.id), true);
  assert.equal(tasks, reference);
  assert.deepEqual(tasks, expected);
});

test("delete: an unknown ID returns false without deleting the final task", () => {
  const before = structuredClone(tasks);
  assert.equal(deleteTask(-999), false);
  assert.deepEqual(tasks, before);
});

test("delete: duplicate titles are independently deletable by ID", () => {
  const first = addTask("相同名稱");
  const second = addTask("相同名稱");
  assert.equal(deleteTask(first.id), true);
  assert.equal(tasks.some((task) => task.id === first.id), false);
  assert.equal(tasks.some((task) => task.id === second.id), true);
});

test("delete: clearing all tasks still allows adding another task", () => {
  for (const task of [...tasks]) assert.equal(deleteTask(task.id), true);
  assert.deepEqual(tasks, []);
  const created = addTask("重新開始");
  assert.deepEqual(tasks, [created]);
  assert.equal(created.completed, false);
});

test("validation: rejects empty, whitespace-only and non-string values", () => {
  const invalid = ["", " ", "\t\r\n", "\u3000", null, undefined, 0, false, {}, []];
  for (const value of invalid) assert.equal(validateTask(value), false);
});

test("validation: accepts nonblank titles, including padded text and emoji", () => {
  for (const title of ["任務", "  任務  ", "0", "✅", "<b>任務</b>"]) {
    assert.equal(validateTask(title), true);
  }
});
