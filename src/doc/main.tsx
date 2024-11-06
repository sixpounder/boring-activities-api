import React from "react";
import ReactDOM from "react-dom/client";
import { ApiDoc } from "./components/ApiDoc";
import "./styles/main.css";
import "highlight.js/styles/night-owl.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApiDoc></ApiDoc>
  </React.StrictMode>,
);
