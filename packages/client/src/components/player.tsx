import type { Player } from "../types";

interface PlayerProps {
    player: Player;
    isCurrentPlayer: boolean;
    onInputChange?: (inputNumber: 1 | 2, value: string) => void;
}

export default function Player({ player, isCurrentPlayer, onInputChange }: PlayerProps) {
    return (
        <div className="player">
            <h1>{player.name}</h1>
            {player.card && <img src={`/cards/${player.card.image}`} alt={player.card.name} />}
            <div className="player-inputs">
                {isCurrentPlayer ? (
                    <>
                        <input
                            type="number"
                            placeholder="Guess 1"
                            value={player.input1}
                            onChange={(e) => onInputChange?.(1, e.target.value)}
                            className="player-input"
                        />
                        <input
                            type="number"
                            placeholder="Guess 2"
                            value={player.input2}
                            onChange={(e) => onInputChange?.(2, e.target.value)}
                            className="player-input"
                        />
                    </>
                ) : (
                    <>
                        {player.input1 && <div className="player-display">{player.input1}</div>}
                        {player.input2 && <div className="player-display">{player.input2}</div>}
                    </>
                )}
            </div>
        </div>
    )
}