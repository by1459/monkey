export interface Player {
  id: string,
  name: string,
  ready: boolean,
}

export interface Lobby {
  players: Player[]
}


