import { useEffect, useState } from "react";
import { type FormEvent } from "react";
import {
  useNavigate,
  type NavigateFunction,
  type NavigateOptions,
} from "react-router-dom";
import { socket } from "../socket.ts";

export default function Home() {
  const [lobbyName, setLobbyName] = useState("");
  const [username, setUsermame] = useState("");
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id);
    });

    socket.on("playerJoined", (lobby) => {
      navigate(`/lobby/${lobbyName}`, {
        state: {
          lobby,
        },
      } as NavigateOptions);
    });

    return () => {
      socket.off("connect");
      socket.off("playerJoined");
    };
  }, [username]);

  const handleJoin = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    socket.emit("joinLobby", lobbyName, username);
  };

  return (
    <div className="home">
      <h2>Monkey</h2>
      <form className="join-form" onSubmit={handleJoin}>
        <p>Lobby Name</p>
        <input
          className="lobby-name"
          value={lobbyName}
          onChange={(e) => setLobbyName(e.target.value)}
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
