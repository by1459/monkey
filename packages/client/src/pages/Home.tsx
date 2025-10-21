import { useEffect, useState } from "react";
import { type FormEvent } from "react";
import {
  useNavigate,
  type NavigateFunction,
  type NavigateOptions,
} from "react-router-dom";
import { socket } from "../socket.ts";
import { type Player, type LobbyState } from "@/types";

export default function Home() {
  const [lobby, setLobby] = useState("");
  const [username, setUsermame] = useState("");
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id);
    });

    socket.on("lobbyCheck", ({ exists, lobbyName }) => {
      console.log(exists, lobbyName);
      if (exists) {
        socket.emit("joinLobby", lobbyName, username);
      } else {
        socket.emit("createLobby", lobbyName, username);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("lobbyCheck");
    };
  }, [username]);

  const handleJoin = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    socket.emit("checkLobby", lobby);
    navigate(`/lobby/${lobby}`, {
      state: {
        players: [
          {
            id: socket.id,
            name: username,
          },
        ],
        lobbyName: lobby,
      } as LobbyState,
    } as NavigateOptions);
  };

  return (
    <div className="home">
      <h2>Monkey</h2>
      <form className="join-form" onSubmit={handleJoin}>
        <p>Lobby Name</p>
        <input
          className="lobby-name"
          value={lobby}
          onChange={(e) => setLobby(e.target.value)}
        />
        <p>Username</p>
        <input
          className="username"
          value={username}
          onChange={(e) => setUsermame(e.target.value)}
        />
        <br />
        <button className="join-lobby">Join</button>
      </form>
    </div>
  );
}
