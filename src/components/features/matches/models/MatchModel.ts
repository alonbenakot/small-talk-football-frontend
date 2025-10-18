import OneLiner from "./OneLiner.ts";

export default interface MatchModel {
  id: string,
  venue: string,
  competition: string,
  score: Score,
  homeTeam: Team,
  awayTeam: Team,
  gaols: Goal[],
  durationInMinutes: number,
  matchDateTime: Date,
  finished: boolean,
  oneLiners: OneLiner[]
}

interface Score {
  winner: string,
  draw: string,
  home: number,
  away: number,
}

export interface Team {
  externalId: string,
  name: string,
  coach: string,
  crest: string
}

interface Goal {
  goalBy: string;
  assistBy: string;
  homeScore: number;
  awayScore: number;
  teamName: string;
  penalty: boolean;
  minute: number;
  teamType: TeamType;
}

export enum TeamType {
  HOME = "HOME",
  AWAY = "AWAY"
}