import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import "./vendor/normalize.css";
import App from "./App";

const rootNode = document.getElementById("root");

const root = createRoot(rootNode);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
