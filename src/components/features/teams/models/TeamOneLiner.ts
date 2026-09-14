import {Lang} from "../../language/Lang.ts";
import {Perspective} from "./Perspective.ts";
import PlayerRecord from "../../players/models/PlayerRecord.ts";

export default interface TeamOneLiner {
  oneLiner: {
    language: Lang,
    competition: string,
    perspective: Perspective,
    text: string,
    generatedAt: string
  },
  facts: TeamFacts
}

export interface TeamFacts {
  id: string,
  name: string,
  crest: string,
  coach: string,
  founded: string,
  venue: Venue,
  primaryCompetition: string | null,   // null for a national side (WORLD_CUP standing only)
  standings: Record<string, Standing>,
  recentForm: FormEntry[],
  nextFixture: NextFixture | null,
  notablePlayers: PlayerRecord[]
}

export interface Venue {
  name: string,
  address: string,
  city: string,
  capacity: string,
  surface: string
}

export interface Standing {
  competition: string,
  position: number,
  playedMatches: number,
  points: number,
  overall: WinDrawLoss,
  home: WinDrawLoss,
  away: WinDrawLoss
}

interface WinDrawLoss {
  wins: number,
  losses: number,
  draws: number
}

export interface FormEntry {
  competition: string,
  date: string,
  opponent: string,
  home: boolean,
  score: string,
  result: "WIN" | "DRAW" | "LOSS"
}

export interface NextFixture {
  fixtureId: string,
  opponent: string,
  home: boolean,
  kickOff: string
}
