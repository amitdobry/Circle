import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement as HTMLElement); // ✅ Cast needed for TS
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
