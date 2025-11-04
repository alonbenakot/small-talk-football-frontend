import { TeamType } from "./MatchModel.ts";
import {Lang} from "../../language/Lang.ts";

export default interface OneLiner {
  text: string,
  language: Lang,
  teamType: TeamType
}