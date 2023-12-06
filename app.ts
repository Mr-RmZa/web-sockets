import * as http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express(); //? Request Handler Valid createServer()
const server = http.createServer(app);
const io = new Server(server);

// Static folder
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Setup websocket
io.on("connection", (socket) => {
  // console.log(`User connected. ${socket.id}`);

  // Listening
  socket.on("login", (data) => {
    console.log(`${data} Connected.`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected.`);
  });

  socket.on("chat message", (data) => {
    io.sockets.emit("chat message", data);
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });
});
