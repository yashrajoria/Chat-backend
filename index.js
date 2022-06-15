const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // where will be the origin of the socket fucntion and where it will be called
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log(`Connection Established, ${socket.id}`); //every time user uses this, id will be logged in here

  socket.on("join_room", (data) => {
    socket.join(data); // here we are using data in order to join the room from the front end
    console.log(`User with ID: ${socket.id} joined room : ${data}`);
  });
  socket.on("send_message", (data) => {
    console.log("emitting to frontend");
    socket.to(data.room).emit("receive_message", data); //sending the data to the frontend to that particular room
  }); //send message to the front end part of the application
  socket.on("disconnection", () => {
    console.log("User Disconnected", socket.id);
  });
});
server.listen(3001, () => {
  console.log("Server connection established and is running");
});
