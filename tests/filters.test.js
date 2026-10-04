import test from "node:test";
import assert from "node:assert/strict";
import { filterTasks } from "../src/filters/filterTasks.js";

const fixture = [
  { id: 1, title: "未完成 A", completed: false },
  { id: 2, title: "已完成", completed: true },
  { id: 3, title: "未完成 B", completed: false },
];

test("filter: all returns all tasks in their original order", () => {
  assert.deepEqual(filterTasks(fixture, "all"), fixture);
});

test("filter: pending returns only incomplete tasks", () => {
  assert.deepEqual(filterTasks(fixture, "pending").map((task) => task.id), [1, 3]);
});

test("filter: completed returns only completed tasks", () => {
  assert.deepEqual(filterTasks(fixture, "completed").map((task) => task.id), [2]);
});

test("filter: unsupported and missing filters fall back to all tasks", () => {
  assert.deepEqual(filterTasks(fixture, "unknown"), fixture);
  assert.deepEqual(filterTasks(fixture), fixture);
});

test("filter: every filter supports an empty task list", () => {
  for (const filter of ["all", "pending", "completed", "unknown"]) {
    assert.deepEqual(filterTasks([], filter), []);
  }
});

test("filter: filtering never mutates the source tasks", () => {
  const source = structuredClone(fixture);
  for (const filter of ["all", "pending", "completed", "unknown"]) {
    filterTasks(source, filter);
  }
  assert.deepEqual(source, fixture);
});
