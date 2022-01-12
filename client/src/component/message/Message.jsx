import React from "react";
import "./message.css";

function Message({ type, body, user }) {
  return (
    <div className={`message-container ${type}`}>
      <div className="message">
        <p className="message--body">{body}</p>
        <p className="user-name">{user ? user : ""}</p>
      </div>
    </div>
  );
}

export default Message;
