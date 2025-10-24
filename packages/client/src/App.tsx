import Home from "./pages/Home.tsx";
import Lobby from "./pages/Lobby.tsx";
import { Routes, Route } from "react-router-dom";

import "./css/App.css";
import Game from "./pages/Game.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/lobby/:lobbyName" element={<Lobby/>}/>
      <Route path="/game/:lobbyName" element={<Game/>}/>
    </Routes>
  );
}

export default App;
