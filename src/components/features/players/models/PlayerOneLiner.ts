import {Lang} from "../../language/Lang.ts";
import {NextFixture, Standing} from "../../teams/models/TeamOneLiner.ts";
import {PlayerStats} from "./PlayerRecord.ts";

export default interface PlayerOneLiner {
  oneLiner: {
    language: Lang,
    text: string,
    generatedAt: string
  },
  facts: PlayerFacts
}

export interface PlayerFacts {
  id: string,
  name: string,
  image: string,
  number: string,
  position: string,
  age: string,
  captain: boolean,
  injured: boolean,
  team: PlayerTeam | null,
  competition: string | null,
  season: PlayerStats,
  leagueScorerRank: number | null,
  squadContext: SquadContext,
  teamStanding: Standing | null,
  recentContributions: Contribution[],
  nextFixture: NextFixture | null
}

export interface PlayerTeam {
  id: string,
  name: string,
  crest: string,
  coach: string
}

export interface SquadContext {
  leadingScorer: boolean,
  leadingContributor: boolean,
  everPresent: boolean,
  firstChoiceKeeper: boolean,
  appearanceShare: number,
  squadSize: number
}

export interface Contribution {
  fixtureId: string,
  date: string,
  opponent: string,
  goals: number,
  assists: number
}
