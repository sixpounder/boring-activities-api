import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiDoc } from "./components/ApiDoc";
import "./styles/main.css";

function init() {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <ApiDoc></ApiDoc>
    </React.StrictMode>,
  );
}

init();
