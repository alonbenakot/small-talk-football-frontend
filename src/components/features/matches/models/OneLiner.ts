import Lang from "../../language/Lang.ts";
import { TeamType } from "./MatchModel.ts";

export default interface OneLiner {
  text: string,
  language: Lang,
  teamType: TeamType
}