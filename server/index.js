const app = require("express")();
const httpServer = require("http").createServer(app);
const Server = require("socket.io").Server;

const { users, addUser, removeUser, findUser } = require("./users");

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("user is connected");

  socket.on("join-public", (userName, roomName) => {
    addUser(userName, socket.id, roomName);
    socket.join(roomName);
    socket.to(roomName).emit("notification", { message: `user: ${userName} has joined the conversation` });
    io.to(roomName).emit("users", { users });
  });

  socket.on("sendmessage", ({ message, roomName }) => {
    io.to(roomName).emit("message", message);
  });
});

httpServer.listen(4000, () => {
  console.log("listening on *:4000");
});
