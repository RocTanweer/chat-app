import React, { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Join from "../pages/join/Join";
import Chat from "../pages/chat/Chat";

function App() {
  const [userName, setUserName] = useState(null);

  console.log("app");

  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate replace to={"/join"} />} />
          <Route path="/join" element={<Join setUserName={setUserName} />} />
          <Route path="/chat" element={<Chat userName={userName} />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
