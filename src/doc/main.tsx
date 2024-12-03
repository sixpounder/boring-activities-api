import { ApiDoc } from "./components/ApiDoc";
import "./styles/main.css";
import "highlight.js/styles/night-owl.css";

async function init() {
  const React = await import("react");
  const ReactDOM = await import("react-dom/client");
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <ApiDoc></ApiDoc>
    </React.StrictMode>,
  );
}

init();
