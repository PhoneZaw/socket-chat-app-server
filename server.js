require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./Routes/auth");
const messageRoutes = require("./Routes/messages");

const app = express();

global.onlineUsers = new Map();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json("Hello");
});
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

mongoose
  .connect(process.env.MONGODB_URL, {
    // useUnifiedTopology: true,
    // userNewurlParser: true,
  })
  .then(() => console.log("Mongodb Connection Successful"))
  .catch((err) => console.log(err.message));

const getAllUsers = (req, res) => {
  const users = [...onlineUsers].map((user) => {
    return user[1].isOnline ? user[0] : undefined;
  });
  res.json(users);
};

app.use("/api/getOnlineUsers", getAllUsers);

const server = app.listen(process.env.PORT, () =>
  console.log("Server is Running on PORT ", process.env.PORT)
);

const socket = require("socket.io");
const io = socket(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://socket-chat-app-client-k7zx.vercel.app",
    ],
  },
});

io.on("connection", (socket) => {
  global.chatSocket = socket;
  let userId = undefined;

  socket.on("add-user", (uid) => {
    userId = uid;
    onlineUsers.set(uid, { id: socket.id, isOnline: true });
    socket.broadcast.emit("online", uid);
  });

  socket.on("send-message", (data) => {
    if (onlineUsers.get(data.to)) {
      const { id: sendUserSocket } = onlineUsers.get(data.to);
      socket.to(sendUserSocket).emit("message-receive", data.message);
    }
  });

  socket.on("disconnect", () => {
    if (userId) {
      onlineUsers.set(userId, {
        id: socket.id,
        isOnline: false,
      });
      console.log("someone Disconnect", onlineUsers);
      socket.broadcast.emit("offline", userId);
    }
  });
});
