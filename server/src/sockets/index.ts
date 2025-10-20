import { Server } from "socket.io";
import handleLobbyEvents from "./lobbyHandler";

export default function registerSocketHandlers(io: Server): void {
  io.on("connect", (socket) => {
    console.log(`socket ${socket.id} just connected`);

    handleLobbyEvents(io, socket);

    socket.on("diconnect", (socket) => {
      console.log(`socket ${socket.id} just disconnected`);
    });
  });
}
