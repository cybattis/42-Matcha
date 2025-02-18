import { io } from "socket.io-client";

// the following forms are similar
const socket = io("ws://localhost:5163/ws");

// client-side
socket.on("connect", () => {
  console.log(socket.id);
  console.log(socket.connected); // true
});

socket.on("disconnect", () => {
  console.log(socket.id);
  console.log(socket.connected); // false
});