import { io, Socket } from "socket.io-client";
import { type DataType, getData } from "../services/api.ts";
import { useEffect, useState } from "react";

export default function Lobby() {
  // const socket: Socket = io('http://localhost:3000');
  const [name, setName] = useState("");
  useEffect(() => {
    const loadHome = async () => {
      try {
        const loadData: DataType = await getData();
        console.log(`${loadData.id} and ${loadData.name}`);
        setName(loadData.name);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error("An unknown error occurred:", error);
        }
      }
    };
    loadHome();
  }, []);
  return (
    <div>
      <h2>This is the lobby</h2>
      <p>{name}</p>
    </div>
  );
}
