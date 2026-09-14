import {LoaderFunctionArgs} from "react-router-dom";
import TeamsResponse, {TeamSummary} from "../../components/features/teams/models/TeamsResponse.ts";
import SquadPlayer from "../../components/features/players/models/SquadPlayer.ts";
import {handleLoaderApiCall} from "../../utils/api/api-utils.ts";
import {getSquad, getTeams} from "../../utils/api/http.ts";

export type TeamLoaderOutput = {
  team: TeamSummary;
  competitions: string[];
  squad: SquadPlayer[];
}

export const teamLoader = async ({params}: LoaderFunctionArgs): Promise<TeamLoaderOutput> => {
  const id = params.id!;

  const [teamsResult, squadResult] = await Promise.all([
    handleLoaderApiCall(() => getTeams(), "Failed to load team", {} as TeamsResponse),
    handleLoaderApiCall(() => getSquad(id), "Failed to load squad", [] as SquadPlayer[]),
  ]);

  if (teamsResult.error) {
    throw new Response(teamsResult.error, {status: teamsResult.statusCode});
  }
  if (squadResult.error) {
    throw new Response(squadResult.error, {status: squadResult.statusCode});
  }

  const rows = teamsResult.data.teams.filter((t) => t.id === id);
  if (rows.length === 0) {
    throw new Response("Team not found", {status: 404});
  }

  return {
    team: rows[0],
    competitions: rows.map((t) => t.competition),
    squad: squadResult.data,
  };
};
