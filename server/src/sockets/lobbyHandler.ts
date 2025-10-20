import { Socket, Server } from "socket.io";

interface Lobby {
  players: string[];
}

const lobbies = new Map<string, Lobby>();

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
      lobby.players.push(playerName);
      socket.join(lobbyName);
      io.to(lobbyName).emit("playerJoined", playerName);
    }
  });

  socket.on("createLobby", (lobbyName: string, playerName: string) => {
    const lobby = lobbies.get(lobbyName);
    console.log(lobby);
    if (!lobby) {
      lobbies.set(lobbyName, {
        players: [playerName],
      });
      socket.join(lobbyName);
      io.emit("lobbyCreated", { lobbyName, playerName });
    }
  });
}
