import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useLocation, useParams } from "react-router-dom";

export default function Lobby() {

  return (
    <div className="lobby">
      <h2></h2>
      <ul className="player-list">
      </ul>
    </div>
  );
}
