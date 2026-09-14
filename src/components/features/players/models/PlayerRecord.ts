export interface PlayerStats {
  matchesPlayed: number | null,
  goals: number | null,
  assists: number | null,
  shotsTotal: number | null,
  keyPasses: number | null,
  passes: number | null,
  passesAccurate: number | null,
  tackles: number | null,
  interceptions: number | null,
  clearances: number | null,
  duelsTotal: number | null,
  duelsWon: number | null,
  saves: number | null,
  insideBoxSaves: number | null,
  goalsConceded: number | null,
  yellowCards: number | null,
  redCards: number | null,
  rating: string
}

export default interface PlayerRecord extends PlayerStats {
  id: string,
  teamId: string,
  teamName: string,
  name: string,
  image: string,
  number: string,
  position: string,
  age: string,
  captain: boolean,
  injured: boolean,
  leagueScorerRank: number | null
}
