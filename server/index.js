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

  socket.on("join-public", (userName, room) => {
    // roomName ===  public
    addUser(userName, socket.id, room);
    socket.join(room.id);
    socket.to(room.id).emit("notification", { message: `user: ${userName} has joined` });
    io.to(room.id).emit("users", { users });
  });

  socket.on("sendmessage", ({ message, roomName, userName }) => {
    socket.to(roomName).emit("receivemessage", { message, userName });
  });

  socket.on("join-room", (roomId, userName) => {
    socket.join(roomId);
    socket.to(roomId).emit("notification", { message: `${userName} has joined` });
  });
});

httpServer.listen(4000, () => {
  console.log("listening on *:4000");
});
