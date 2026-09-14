export interface TeamSummary {
  id: string,
  name: string,
  crest: string,
  competition: string,
  position: number,
  points: number
}

export default interface TeamsResponse {
  competitions: string[],
  teams: TeamSummary[]
}
