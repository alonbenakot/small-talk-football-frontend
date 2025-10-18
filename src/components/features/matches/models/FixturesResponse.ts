import MatchModel from "./MatchModel.ts";

export default interface FixturesResponse {
  competitions: string[],
  fixtures: MatchModel[]
}
