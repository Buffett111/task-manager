# React Task Manager

以 React state 完成新增任務、完成／取消完成及刪除任務，並同步顯示統計。

## 啟動

在此 react 目錄執行：

```sh
npm ci
npm run dev
```

開啟 http://127.0.0.1:5173/ 。請使用 Vite 伺服器，不要雙擊 index.html 或透過原生版本的靜態伺服器直接開啟 JSX。

需要 Node.js 20.19+ 或 22.12+ 的受支援版本。依賴版本由 package-lock.json 固定。

## 建置

```sh
npm run build
npm run preview
```

建置輸出在 dist，正式版預覽網址為 http://127.0.0.1:5174/ 。

## 程式結構

- src/main.jsx：建立 React root，載入 App 與樣式。
- src/App.jsx：state、事件處理與 JSX 清單。
- src/styles.css：React 頁面的版面與手機樣式。

事件函式位於 App 內，透過 setTasks 的函式形式取得最新資料。新增使用新陣列、完成切換使用 map、刪除使用 filter；React 依 state 更新畫面。每筆任務有穩定 id 作為 key，同名任務也能分別操作。

任務僅存在記憶體，重新整理會回復三筆初始任務。本階段未加入持久化或 React 篩選功能；作業的 React 階段要求是新增、完成與刪除。

測試結果與截圖請見 [TESTING.md](TESTING.md)。
