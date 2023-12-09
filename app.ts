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

const users: any = {};

// io.use((socket, next) => {
//     // console.log(socket);
//     const token = socket.handshake.auth.token;
//     const id = 123456;

//     if (token == undefined) {
//         console.log("client is not connecting");
//     } else if (token != id) {
//         console.log("you can't login");
//     }

//     if (token === id) {
//         next();
//     }
// });

const chatNamespace = io.of("/chat");

chatNamespace.on("connection", (socket) => {
  // console.log(`User connected. ${socket.id}`);

  // Listening

  socket.on("login", (data) => {
    console.log(`${data.nickname} Connected.`);
    socket.join(data.roomNumber);

    users[socket.id] = {
      nickname: data.nickname,
      roomNumber: data.roomNumber,
    };
    chatNamespace.emit("online", users);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected.`);
    delete users[socket.id];
    chatNamespace.emit("online", users);
  });

  socket.on("chat message", (data) => {
    chatNamespace.to(data.roomNumber).emit("chat message", data);
  });

  socket.on("typing", (data) => {
    socket.broadcast.in(data.roomNumber).emit("typing", data);
  });

  socket.on("pvChat", (data) => {
    console.log(`Private Chat Data: ${data}`);
    console.log(data.to);
    chatNamespace.to(data.to).emit("pvChat", data);
  });
});
