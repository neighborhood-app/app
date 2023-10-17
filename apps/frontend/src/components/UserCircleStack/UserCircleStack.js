import React from "react";
import UserCircle from "../UserCircle/UserCircle.js";

export default function UserCircleStack({ usernames }) {
  const displayUsers = usernames.slice(0, 4);

  return (
    <div className="circle-container">
      {displayUsers.map((username) => (
        <UserCircle key={username} username={username} />
      ))}
    </div>
  );
}
