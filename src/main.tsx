// ============================================================
// main.tsx - অ্যাপ্লিকেশনের এন্ট্রি পয়েন্ট
// ============================================================

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
