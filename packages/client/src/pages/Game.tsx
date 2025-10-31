import type { Lobby } from "../types";
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
    const [pairs, setPairs] = useState<number>(0);
    const [triples, setTriples] = useState<number>(0);
    const [quads, setQuads] = useState<number>(0);

    // Function to count pairs, triples, and quads
    const calculateMatches = (players: typeof lobby.players) => {
        console.log("Calculating matches for players: ", players);
        // Count card values
        const valueCounts = new Map<number, number>();
        
        players.forEach((player) => {
            if (player.card) {
                const value = player.card.value;
                valueCounts.set(value, (valueCounts.get(value) || 0) + 1);
            }
        });

        // Count pairs, triples, and quads
        let pairCount = 0;
        let tripleCount = 0;
        let quadCount = 0;

        valueCounts.forEach((count) => {
            if (count === 2) pairCount++;
            else if (count === 3) tripleCount++;
            else if (count === 4) quadCount++;
        });

        setPairs(pairCount);
        setTriples(tripleCount);
        setQuads(quadCount);
    };

    useEffect(() => {
        socket.on("startGame", (newLobby: Lobby) => {
            console.log("Game starting with new cards!");
            setLobby(newLobby);
            setRevealed(false);
            setPlayAgainReady(false);
            setPlayAgainCount({ readyCount: 0, totalCount: newLobby.players.length });
            calculateMatches(newLobby.players);
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

        socket.on("playerInputUpdate", (updatedPlayers) => {
            setLobby(prevLobby => ({
                ...prevLobby,
                players: updatedPlayers
            }));
        });

        calculateMatches(lobby.players);

        return () => {
            socket.off("startGame");
            socket.off("playAgainUpdate");
            socket.off("playerInputUpdate");
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

    const handleInputChange = (inputNumber: 1 | 2, value: string) => {
        if (lobbyName) {
            socket.emit("updatePlayerInput", { lobbyName, inputNumber, value });
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
                                <div className="player-inputs">
                                    <input
                                        type="number"
                                        placeholder="Guess 1"
                                        value={player.input1}
                                        onChange={(e) => handleInputChange(1, e.target.value)}
                                        className="player-input"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Guess 2"
                                        value={player.input2}
                                        onChange={(e) => handleInputChange(2, e.target.value)}
                                        className="player-input"
                                    />
                                </div>
                            </div>
                        );
                    }
                    
                    // For all other cases (other players or revealed current player)
                    return (
                        <Player 
                            key={player.id}
                            player={player} 
                            isCurrentPlayer={isCurrentPlayer}
                            onInputChange={isCurrentPlayer ? handleInputChange : undefined}
                        />
                    );
                })}
            </div>
            <div className="info-box">
                {pairs > 0 && <div>Pairs: {pairs}</div>}
                {triples > 0 && <div>Triples: {triples}</div>}
                {quads > 0 && <div>Quads: {quads}</div>}
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