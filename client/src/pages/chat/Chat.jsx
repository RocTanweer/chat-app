import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

import Message from "../../component/message/Message";

import "./chat.css";

let socket;

function Chat({ userName }) {
  const [room, setRoom] = useState({ name: "Public Chat", id: "123" });
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState({ ["123"]: [] });

  const chatBox = useRef();

  useEffect(() => {
    const handleScrolling = (event) => {
      const { currentTarget: target } = event;
      target.scroll({ top: target.scrollHeight, behavior: "smooth" });
    };
    if (chatBox) {
      chatBox.current.addEventListener("DOMNodeInserted", handleScrolling);
    }
    return () => {
      chatBox.current.removeEventListener("DOMNodeInserted", handleScrolling);
    };
  }, []);

  useEffect(() => {
    socket = io("http://localhost:4000");

    socket.emit("join-public", userName, room);

    socket.on("notification", ({ message, roomName }) => {
      // setMessages((prev) => [...prev, { type: "notification", body: message }]);
      setMessages((prev) => {
        return { ...prev, [roomName]: [...prev[roomName], { type: "notification", body: message }] };
      });
    });

    socket.on("users", ({ users }) => {
      setUsers(users);
    });

    socket.on("receivemessage", ({ message, userName, roomName }) => {
      // setMessages((prev) => [...prev, { type: "receive", body: message, user: userName }]);
      if (!messages[roomName]) {
        setMessages((prev) => {
          return { ...prev, [roomName]: [] };
        });
      }
      setMessages((prev) => {
        return { ...prev, [roomName]: [...prev[roomName], { type: "receive", body: message, user: userName }] };
      });
    });
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    // setMessages((prev) => [...prev, { type: "send", body: message, user: userName }]);
    setMessages((prev) => {
      return { ...prev, [room.id]: [...prev[room.id], { type: "send", body: message, user: userName }] };
    });
    socket.emit("sendmessage", { message, roomName: room.id, userName });
    e.target.message.value = "";
  };

  const handleRoomButton = (e, name, id) => {
    if (room.id !== id) setRoom({ name, id });
    socket.emit("join-room", { roomId: id, userName });
    if (!messages[id]) {
      setMessages((prev) => {
        return { ...prev, [id]: [] };
      });
    }
  };

  return (
    <section className="chat">
      <div className="chat__aside">
        <div className="chat__aside--rooms">
          <h2>Rooms</h2>

          <ul className="list">
            {users.length !== 0 &&
              users
                .find((user) => user.userName === userName)
                ?.rooms.map((room, index) => {
                  const { name, id } = room;
                  return (
                    <li key={index}>
                      <button onClick={(e) => handleRoomButton(e, name, id)}>{name}</button>
                    </li>
                  );
                })}
          </ul>
        </div>
        <div className="chat__aside--users">
          <h2>Active Users</h2>
          <ul className="list">
            {users.length !== 0 &&
              users
                .filter((user) => user.userName !== userName)
                .map((user, index) => {
                  const { userName: name, userId: id } = user;
                  return (
                    <li key={index}>
                      <button onClick={(e) => handleRoomButton(e, name, id)}>{name}</button>
                    </li>
                  );
                })}
          </ul>
        </div>
      </div>
      <div className="chat__room">
        <div className="chat__room--name">
          <p className="roomName">{room.name}</p>
        </div>
        <div ref={chatBox} className="chat__room--messages">
          {messages[room.id].map((message, index) => {
            const { type, body, user } = message;
            return <Message key={index} user={user} type={type} body={body} />;
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
