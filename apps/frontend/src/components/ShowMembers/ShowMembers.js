import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import UserCircleStack from "./UserCircleStack/UserCircleStack.js";

function App() {
  const usernames = ["radu", "antonina", "ecem", "maria", "mike", "john"];

  return (
    <div>
      <UserCircleStack usernames={usernames} />
    </div>
  );
}

// React 18
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
