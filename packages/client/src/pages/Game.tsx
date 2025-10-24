import type { Lobby } from "@/types";
import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Player from "../components/player";
import { socket } from "../socket";
import "../css/Game.css";

export default function Game() {
    const location = useLocation();
    const { lobbyName } = useParams();
    const initialLobby: Lobby = location.state?.lobby as Lobby;
    const [lobby, setLobby] = useState<Lobby>(initialLobby);
    const [revealed, setRevealed] = useState(false);
    const [playAgainReady, setPlayAgainReady] = useState(false);
    const [playAgainCount, setPlayAgainCount] = useState({ readyCount: 0, totalCount: lobby.players.length });

    useEffect(() => {
        socket.on("startGame", (newLobby: Lobby) => {
            console.log("Game starting with new cards!");
            setLobby(newLobby);
            setRevealed(false);
            setPlayAgainReady(false);
            setPlayAgainCount({ readyCount: 0, totalCount: newLobby.players.length });
        });

        socket.on("playAgainUpdate", ({ readyCount, totalCount, players }) => {
            setPlayAgainCount({ readyCount, totalCount });
            setLobby(prevLobby => ({
                ...prevLobby,
                players: players
            }));
            const currentPlayer = players.find((p: any) => p.id === socket.id);
            if (currentPlayer) {
                setPlayAgainReady(currentPlayer.playAgainReady);
            }
        });

        return () => {
            socket.off("startGame");
            socket.off("playAgainUpdate");
        };
    }, []);

    const handleReveal = () => {
        setRevealed(true);
    };

    const handlePlayAgain = () => {
        if (lobbyName && !playAgainReady) {
            socket.emit("playAgain", lobbyName);
        }
    };

    return (
        <div className="game">
            <div className="all-players">
                {lobby.players.map((player) => {
                    const isCurrentPlayer = player.id === socket.id;
                    
                    // If it's the current player and not revealed yet
                    if (isCurrentPlayer && !revealed) {
                        return (
                            <div key={player.id} className="player hidden-card">
                                <h1>{player.name}</h1>
                                <button onClick={handleReveal}>Reveal</button>
                            </div>
                        );
                    }
                    
                    // For all other cases (other players or revealed current player)
                    return <Player key={player.id} player={player} />;
                })}
            </div>
            {revealed && (
                <div className="game-controls">
                    <div className="play-again-status">
                        {playAgainCount.readyCount} / {playAgainCount.totalCount} players ready
                    </div>
                    <button 
                        onClick={handlePlayAgain} 
                        className={`play-again-button ${playAgainReady ? 'ready' : ''}`}
                        disabled={playAgainReady}
                    >
                        {playAgainReady ? "Waiting for others..." : "Play Again"}
                    </button>
                </div>
            )}
        </div>
    );
}