import { Socket, Server } from "socket.io";
import { type Player } from "@/types";

const lobbies = new Map<string, Player[]>();

export default function handleLobbyEvents(io: Server, socket: Socket) {
  socket.on("checkLobby", (lobbyName: string) => {
    const exists = lobbies.has(lobbyName);
    console.log(`${lobbyName} does exist: ${exists}`);
    console.log(lobbies);
    socket.emit("lobbyCheck", { exists, lobbyName });
  });

  socket.on("joinLobby", (lobbyName: string, playerName: string) => {
    const lobby = lobbies.get(lobbyName);
    console.log("this should be called the second tiem");
    if (lobby) {
      lobby.push({ id: socket.id, name: playerName });
      socket.join(lobbyName);
      io.to(lobbyName).emit("playerJoined", playerName);
    }
  });

  socket.on("createLobby", (lobbyName: string, playerName: string) => {
    const lobby = lobbies.get(lobbyName);
    console.log(lobby);
    if (!lobby) {
      lobbies.set(lobbyName, [
        {
          id: socket.id,
          name: playerName,
        },
      ]);
      socket.join(lobbyName);
      io.emit("lobbyCreated", { lobbyName, playerName });
    }
  });
}
