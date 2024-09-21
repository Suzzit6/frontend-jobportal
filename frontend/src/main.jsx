import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { UserProvider } from "./context/UserContext"; // Import UserProvider
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      {" "}
      {/* Wrap App with UserProvider */}
      <App />
    </UserProvider>
  </StrictMode>
);
