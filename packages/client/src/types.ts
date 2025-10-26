export interface Card {
  name: string,
  value: number,
  image: string,
}

export interface Player {
  id: string,
  name: string,
  ready: boolean,
  playAgainReady: boolean,
  card: Card | null,
}

export interface Lobby {
  players: Player[],
  deck: Card[] | null,
}

