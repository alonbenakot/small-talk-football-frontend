import {Lang} from "../../components/features/language/Lang.ts";
import {TeamType} from "../../components/features/matches/models/MatchModel.ts";
import {Perspective} from "../../components/features/teams/models/Perspective.ts";

export interface LoginInput {
  email: string,
  password: string
}

export interface SignUpInput {
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  priorFootballKnowledge: boolean,
  userIndications: {
    preferredLanguage: Lang
  }
}

export interface AddArticleInput {
  title: string,
  author: string,
  text: string,
}

export interface OneLinerInput {
  lang: Lang,
  teamType?: TeamType,
  matchId: string
}

export interface TeamOneLinerInput {
  teamId: string,
  lang: Lang,
  perspective?: Perspective,
  competition?: string
}

export interface PlayerOneLinerInput {
  playerId: string,
  lang: Lang
}
