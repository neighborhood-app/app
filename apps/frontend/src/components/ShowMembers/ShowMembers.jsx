import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const usernames = ["radu", "antonina", "ecem", "maria", "mike", "john"];

function App() {
  return (
    <div>
      <UserCircleStack />
    </div>
  );
}

function UserCircleStack() {
  const displayUsers = usernames.slice(0, 4);

  return (
    <div className="circle-container">
      {displayUsers.map((username) => (
        <UserCircle key={username} username={username} />
      ))}
    </div>
  );
}

function UserCircle({ username }) {
  const firstTwoLetters = username.slice(0, 2).toUpperCase();

  return (
    <div className="circle" style={{ style: "--i: 1" }}>
      {firstTwoLetters}
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
