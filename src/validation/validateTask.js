export function validateTask(title) {
  return typeof title === "string" && title.trim().length > 0;
}
