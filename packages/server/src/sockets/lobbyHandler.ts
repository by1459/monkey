import { Socket, Server } from "socket.io";
import { type Player, type Lobby } from "../types";
import { DECK } from "../constants/deck";

const lobbies = new Map<string, Lobby>();

export default function handleLobbyEvents(io: Server, socket: Socket) {
  const checkReady = (lobbyName: string) => {
    const lobby = lobbies.get(lobbyName);
    if (lobby && lobby.players.every((player) => player.ready)) {
      lobby.deck = DECK.slice();
      lobby.players.forEach((player) => {
        player.card = lobby.deck![Math.floor(Math.random() * lobby.deck!.length)];
        lobby.deck!.splice(lobby.deck!.indexOf(player.card!), 1);
        player.playAgainReady = false; // Reset play again ready status
      });
      io.to(lobbyName).emit("startGame", lobby as Lobby);
    }
  }

  const removePlayerFromLobby = (lobbyName: string, playerId: string) => {
    console.log(`Player ${playerId} disconnected from ${lobbyName}`);
    const lobby = lobbies.get(lobbyName);
    if (lobby) {
      const playerIndex = lobby.players.findIndex(
        (player) => player.id === playerId
      );
      if (playerIndex !== -1) {
        lobby.players.splice(playerIndex, 1);
        console.log(`Remaining players in ${lobbyName}: ${lobby.players.length}`);
        io.to(lobbyName).emit("playerDisconnected", lobby);
        if (lobby.players.length === 0) {
          lobbies.delete(lobbyName);
          console.log(`✅ Lobby "${lobbyName}" destroyed (no players remaining)`);
          console.log(`📊 Total active lobbies: ${lobbies.size}`);
        }
      }
    }
  };

  socket.on("joinLobby", (lobbyName: string, playerName: string) => {
    const lobby = lobbies.get(lobbyName);
    if (lobby) {
      lobby.players.push({ id: socket.id, name: playerName, ready: false, playAgainReady: false, card: null } as Player);
    } else {
      lobbies.set(lobbyName, {
        players: [{ id: socket.id, name: playerName, ready: false, playAgainReady: false, card: null } as Player],
        deck: null,
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
      checkReady(lobbyName as string);
    }
  });

  socket.on("playAgain", (lobbyName: string) => {
    const lobby = lobbies.get(lobbyName);
    if (lobby) {
      const player = lobby.players.find((player) => player.id === socket.id);
      if (player) {
        player.playAgainReady = true;
        
        // Emit update with count of ready players
        const readyCount = lobby.players.filter(p => p.playAgainReady).length;
        const totalCount = lobby.players.length;
        io.to(lobbyName).emit("playAgainUpdate", { 
          readyCount, 
          totalCount,
          players: lobby.players
        });
        
        // Check if all players are ready to play again
        if (lobby.players.every((player) => player.playAgainReady)) {
          // Set all players to ready for the game
          lobby.players.forEach((player) => {
            player.ready = true;
          });
          checkReady(lobbyName);
        }
      }
    }
  });

  socket.on("leaveLobby", (lobbyName: string) => {
    removePlayerFromLobby(lobbyName, socket.id);
    socket.leave(lobbyName);
  });

  socket.on("disconnect", () => {
    // Find which lobby the player was in
    lobbies.forEach((lobby, lobbyName) => {
      removePlayerFromLobby(lobbyName, socket.id);
    });
  });
}
