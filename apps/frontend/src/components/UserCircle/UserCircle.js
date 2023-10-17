import React from "react";

export default function UserCircle({ username }) {
  const firstTwoLetters = username.slice(0, 2).toUpperCase();

  return (
    <div className="circle" style={{ style: "--i: 1" }}>
      {firstTwoLetters}
    </div>
  );
}
