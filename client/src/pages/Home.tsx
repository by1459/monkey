import { io, Socket } from "socket.io-client";
import { type DataType, getData } from "../services/api.ts";
import { useEffect, useState } from "react";
import { type FormEvent } from "react";
import {
  useNavigate,
  type NavigateFunction,
  type NavigateOptions,
} from "react-router-dom";
import { socket } from "../socket.ts";

export interface LobbyState {
  username: string;
}

export default function Home() {
  const [lobby, setLobby] = useState("");
  const [username, setUsermame] = useState("");
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server with ID:', socket.id);
    });

    return () => {
      socket.off('connect');
    };
  }, []);

  const handleJoin = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log(lobby);
    console.log(username);
    navigate(`/lobby/${lobby}`, {
      state: { username } as LobbyState,
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
