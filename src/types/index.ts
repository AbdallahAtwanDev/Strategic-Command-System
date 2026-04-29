export interface Player {
  id: string;
  name: string;
}

export interface PlayerPlacement {
  playerId: string;
  x: number;
  y: number;
}

export interface TeamData {
  players: Player[];
  placements: Record<string, PlayerPlacement>;
}

export interface SystemState {
  teamA: TeamData;
  teamB: TeamData;
  activeTeam: 'A' | 'B';
}