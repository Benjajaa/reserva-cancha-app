import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import AuthProviderWithHistory from "./auth/AuthProviderWithHistory.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProviderWithHistory>
      <App />
    </AuthProviderWithHistory>
  </React.StrictMode>
);
