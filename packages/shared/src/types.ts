export interface Player {
  id: string,
  name: string,
}

export interface LobbyState {
  lobbyName: string;
  players: Player[];
}


