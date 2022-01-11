import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

import "./chat.css";

let socket;

function Chat({ userName, roomName }) {
  const [notification, setNotification] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, Setmessages] = useState([]);

  useEffect(() => {
    socket = io("http://localhost:4000");

    socket.emit("join-public", userName, roomName);

    socket.on("notification", ({ message }) => {
      setNotification(message);
    });

    socket.on("users", ({ users }) => {
      setUsers(users);
    });

    socket.on("message", (message) => {
      Setmessages((prev) => [...prev, message]);
    });
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    socket.emit("sendmessage", { message: e.target.message.value, roomName });
  };

  return (
    <section className="chat">
      <div className="chat__aside">
        <div className="chat__aside--rooms">
          <h2>Rooms</h2>

          <ul>
            {users
              .find((user) => user.userName === userName)
              ?.rooms.map((room, index) => {
                return <li key={index}>{room}</li>;
              })}
          </ul>
        </div>
        <div className="chat__aside--users">
          <h2>Active Users</h2>
          {users
            .filter((user) => user.userName !== userName)
            .map((user, index) => {
              return <li key={index}>{user.userName}</li>;
            })}
        </div>
      </div>
      <div className="chat__room">
        <div className="chat__room--messages">
          <span>{notification}</span>
          {messages.map((message, index) => {
            return <li key={index}>{message}</li>;
          })}
        </div>
        <div className="chat__room--form">
          <form onSubmit={handleFormSubmit}>
            <input name="message" type="text" autoComplete="off" placeholder="Enter your message..." />
            <button type="submit">send</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Chat;
