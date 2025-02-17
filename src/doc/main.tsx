import { QueryClient, QueryClientProvider } from "react-query";
import { ApiDoc } from "./components/ApiDoc";
import "./styles/main.css";
import "highlight.js/styles/night-owl.css";

async function init() {
  const React = await import("react");
  const ReactDOM = await import("react-dom/client");
  const queryClient = new QueryClient();
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ApiDoc></ApiDoc>
      </QueryClientProvider>
    </React.StrictMode>,
  );
}

init();
