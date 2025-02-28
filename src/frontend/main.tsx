import { scan } from "react-scan";
import React from "react";
import ReactDOM from "react-dom/client";
import { ApiDoc } from "./components/ApiDoc";
import "./styles/main.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

if (typeof window !== "undefined") {
  scan({
    enabled: BA_ENV === "development",
    log: true, // logs render info to console (default: false)
  });
}

function init() {
  const queryClient = new QueryClient();
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ApiDoc></ApiDoc>
      </QueryClientProvider>
    </React.StrictMode>,
  );
}

init();
