import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AppShell from "./AppShell";
import { AuthProvider } from "./auth";
import "./styles/tailwind.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppShell>
          <App />
        </AppShell>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
