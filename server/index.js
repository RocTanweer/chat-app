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
    // roomName ===  public
    addUser(userName, socket.id, roomName);
    socket.join(roomName);
    socket.to(roomName).emit("notification", { message: `user: ${userName} has joined ${roomName}` });
    io.to(roomName).emit("users", { users });
  });

  socket.on("sendmessage", ({ message, roomName, userName }) => {
    socket.to(roomName).emit("receivemessage", { message, userName });
  });

  socket.on("join-room", (roomName, userName) => {
    socket.join(roomName);
    socket.to(roomName).emit("notification", { message: `${userName} has joined ${roomName}` });
  });
});

httpServer.listen(4000, () => {
  console.log("listening on *:4000");
});
