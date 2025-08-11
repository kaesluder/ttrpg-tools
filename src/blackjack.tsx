import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import SurvivalBlackjackTable from "./SurvivalBlackjackTable.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SurvivalBlackjackTable />
  </StrictMode>,
);
