import { Server } from "socket.io";

export default function handleLobbyEvents(io: Server) {
  io.on("createLobby", (data) => {
    console.log(`creating new lobby ${data}`);
  });
}
