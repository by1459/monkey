import type { Player } from "@/types";

export default function Player({ player }: { player: Player }) {
    return (
        <div className="player">
            <h1>{player.name}</h1>
            {player.card && <img src={`/public/cards/${player.card.image}`} alt={player.card.name} />}
        </div>
    )
}