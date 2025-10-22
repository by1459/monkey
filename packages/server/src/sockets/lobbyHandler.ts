import { Socket, Server } from "socket.io";
import { type Player, type Lobby } from "@/types";

const lobbies = new Map<string, Lobby>();

export default function handleLobbyEvents(io: Server, socket: Socket) {

  socket.on("joinLobby", (lobbyName: string, playerName: string) => {
    const lobby = lobbies.get(lobbyName);
    if (lobby) {
      lobby.players.push({ id: socket.id, name: playerName, ready: false } as Player);
    } else {
      lobbies.set(lobbyName, {
        players: [{ id: socket.id, name: playerName, ready: false } as Player],
      });
    }
    socket.join(lobbyName);
    io.to(lobbyName).emit("playerJoined", lobbies.get(lobbyName));
  });

  socket.on("ready", (lobbyName: string, ready: boolean) => {
    const lobby = lobbies.get(lobbyName);
    if (lobby) {
      const player = lobby.players.find((player) => player.id === socket.id);
      if (player) {
        player.ready = ready;
        io.to(lobbyName).emit("ready", lobbies.get(lobbyName));
      }
      if (lobby.players.every((player) => player.ready)) {
        io.to(lobbyName).emit("startGame");
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(`Player ${socket.id} disconnected`);
    lobbies.forEach((lobby, lobbyName) => {
      const playerIndex = lobby.players.findIndex(
        (player) => player.id === socket.id
      );
      if (playerIndex !== -1) {
        lobby.players.splice(playerIndex, 1);
        console.log(`Removed player from lobby: ${lobbyName}`);
        
        if (lobby.players.length === 0) {
          lobbies.delete(lobbyName);
          console.log(`Deleted empty lobby: ${lobbyName}`);
        } else {
          io.to(lobbyName).emit("playerDisconnected", lobbies.get(lobbyName));
        }
      }
    });
  });
}
