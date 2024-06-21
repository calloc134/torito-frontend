import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App.tsx";
import { App } from "./components/App";
import "./index.css";
import "@fontsource/montserrat/600.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
