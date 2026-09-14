import {LoaderFunctionArgs} from "react-router-dom";
import SquadPlayer from "../../components/features/players/models/SquadPlayer.ts";
import {handleLoaderApiCall} from "../../utils/api/api-utils.ts";
import {getSquad} from "../../utils/api/http.ts";

export type PlayerLoaderOutput = {
  teamId: string;
  player: SquadPlayer;
}

export const playerLoader = async ({params}: LoaderFunctionArgs): Promise<PlayerLoaderOutput> => {
  const teamId = params.teamId!;
  const playerId = params.playerId!;

  const result = await handleLoaderApiCall(() => getSquad(teamId), "Failed to load squad", [] as SquadPlayer[]);

  if (result.error) {
    throw new Response(result.error, {status: result.statusCode});
  }

  const player = result.data.find((p) => p.id === playerId);
  if (!player) {
    throw new Response("Player not found", {status: 404});
  }

  return {teamId, player};
};
