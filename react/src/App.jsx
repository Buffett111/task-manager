import React, { useRef, useState } from "react";

export default function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "完成 Web App 實作", completed: false },
    { id: 2, title: "完成 JavaScript 練習", completed: false },
    { id: 3, title: "完成課程作業", completed: true }
  ]);
  const [title, setTitle] = useState("");
  const [feedback, setFeedback] = useState("");
  const [invalid, setInvalid] = useState(false);
  const nextId = useRef(4);
  const inputRef = useRef(null);

  // 事件函式須放在 app function內，才能取得本次 render 的 state。
  function addTask(event) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setFeedback("不能輸入空白，請輸入任務名稱。");
      setInvalid(true);
      inputRef.current.focus();
      return;
    }

    const newTask = { id: nextId.current++, title: trimmedTitle, completed: false };
    // 使用最新的 state 建立新陣列，React 會自動重新渲染。
    setTasks((previousTasks) => [...previousTasks, newTask]);
    setTitle("");
    setInvalid(false);
    setFeedback("任務已新增。");
    inputRef.current.focus();
  }

  function toggleTask(id) {
    setTasks((previousTasks) => previousTasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    setFeedback("任務完成狀態已切換。");
  }

  function deleteTask(id) {
    setTasks((previousTasks) => previousTasks.filter((task) => task.id !== id));
    setFeedback("任務已刪除。");
    inputRef.current.focus();
  }

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <div className="app">
      <header className="app-header">
        <p className="version-label">REACT VERSION</p>
        <h1>我的任務 · Task Manager</h1>
        <p>今天也完成一點事情吧！</p>
      </header>
      <main>
        <section className="add-task-section" aria-label="新增任務">
          <form onSubmit={addTask} noValidate>
            <label htmlFor="taskInput">新增任務</label>
            <div className="input-group">
              <input
                ref={inputRef}
                id="taskInput"
                type="text"
                placeholder="例如：完成 React 練習"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setInvalid(false);
                  setFeedback("");
                }}
                aria-invalid={invalid}
                aria-describedby="taskFeedback"
              />
              <button type="submit" className="add-btn">＋ 新增</button>
            </div>
          </form>
        </section>
        <p id="taskFeedback" className="task-feedback" role="status" aria-live="polite">
          {feedback}
        </p>
        <section className="task-section" aria-labelledby="listHeading">
          <h2 id="listHeading">任務清單</h2>
          {tasks.length === 0 && <p className="empty-message">目前沒有任務，新增第一筆任務吧！</p>}
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className={`task-item${task.completed ? " completed" : ""}`}>
                <label className="task-content">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    aria-label={`切換完成狀態：${task.title}`}
                  />
                  <span>{task.title}</span>
                </label>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`刪除任務：${task.title}`}
                >刪除</button>
              </li>
            ))}
          </ul>
        </section>
        <section className="stats-section" aria-label="任務統計">
          <span>共 <strong id="totalCount">{tasks.length}</strong> 項</span>
          <span>未完成 <strong id="pendingCount">{tasks.length - completedCount}</strong> 項</span>
          <span>已完成 <strong id="completedCount">{completedCount}</strong> 項</span>
        </section>
      </main>
      <p className="session-note">任務暫存於本次頁面，重新整理後會回復初始清單。</p>
    </div>
  );
}
