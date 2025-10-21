import Home from "./pages/Home.tsx";
import Lobby from "./pages/Lobby.tsx";
import { Routes, Route } from "react-router-dom";

import "./css/App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/lobby" element={<Lobby/>}/>
    </Routes>
  );
}

export default App;
