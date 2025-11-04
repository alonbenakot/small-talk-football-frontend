import {Lang} from "../../components/features/language/Lang.ts";
import {TeamType} from "../../components/features/matches/models/TeamType.tsx";

export interface LoginInput {
  email: string,
  password: string
}

export interface SignUpInput {
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  priorFootballKnowledge: boolean
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