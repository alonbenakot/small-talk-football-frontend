import {LoaderFunctionArgs} from "react-router-dom";
import {TeamFacts} from "../../components/features/teams/models/TeamOneLiner.ts";
import SquadPlayer from "../../components/features/players/models/SquadPlayer.ts";
import {handleLoaderApiCall} from "../../utils/api/api-utils.ts";
import {getSquad, getTeamFacts} from "../../utils/api/http.ts";

export type TeamLoaderOutput = {
  facts: TeamFacts;
  squad: SquadPlayer[];
}

export const teamLoader = async ({params}: LoaderFunctionArgs): Promise<TeamLoaderOutput> => {
  const id = params.id!;

  const [factsResult, squadResult] = await Promise.all([
    handleLoaderApiCall(() => getTeamFacts(id), "Failed to load team", {} as TeamFacts),
    handleLoaderApiCall(() => getSquad(id), "Failed to load squad", [] as SquadPlayer[]),
  ]);

  if (factsResult.error) {
    throw new Response(factsResult.error, {status: factsResult.statusCode});
  }
  if (squadResult.error) {
    throw new Response(squadResult.error, {status: squadResult.statusCode});
  }

  return {facts: factsResult.data, squad: squadResult.data};
};
