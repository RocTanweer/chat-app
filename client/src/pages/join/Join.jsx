import React from "react";
import { useNavigate } from "react-router-dom";

import "./join.css";

function Join({ setUserName }) {
  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setUserName(e.target.username.value);
    navigate("/chat", { replace: true });
  };

  return (
    <section>
      <form onSubmit={handleFormSubmit}>
        <div>
          <input name="username" autoComplete="off" type="text" placeholder="Enter your username" />
          <button type="submit">Join</button>
        </div>
      </form>
    </section>
  );
}

export default Join;
