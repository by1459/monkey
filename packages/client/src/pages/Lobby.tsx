import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useParams, useLocation } from "react-router-dom";
import { type Lobby, type Player } from "@/types";

export default function Lobby() {
  
  const [ready, setReady] = useState<boolean>(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const { lobbyName } = useParams();
  const location = useLocation();
  const lobbyState: Lobby = location.state?.lobby as Lobby;

  useEffect(() => {
    setPlayers(lobbyState.players);
    
    socket.on("playerJoined", (lobby: Lobby) => {
      setPlayers(lobby.players);
    });

    socket.on("playerDisconnected", (lobby: Lobby) => {
      setPlayers(lobby.players);
    });

    socket.on("ready", (lobby: Lobby) => {
      setPlayers(lobby.players);
    });

    socket.on("startGame", () => {
      console.log("Starting game");
    });

    return () => {
      socket.off("playerJoined");
      socket.off("playerDisconnected");
      socket.off("startGame");
    };
  }, []);

  const handleReady = () => {
    const newReady = !ready;
    console.log("Ready state originally was", ready);
    setReady(newReady);
    console.log("Ready state changed to", newReady);
    socket.emit("ready", lobbyName, newReady);
  }
  return (
    <div className="lobby">
      <h2>{lobbyName}</h2>
      <ul className="player-list">
        {players.map((player) => {
          return <li key={player.id}>{player.name} {player.ready ? "✅" : "❌"}</li>
        })}
      </ul>
      <button className="start-game" onClick={handleReady}>{ready ? "Not ready" : "Ready up"}</button>
    </div>
  );
}
