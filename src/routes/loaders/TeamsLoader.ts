import TeamsResponse from "../../components/features/teams/models/TeamsResponse.ts";
import {handleLoaderApiCall} from "../../utils/api/api-utils.ts";
import {getTeams} from "../../utils/api/http.ts";

export type TeamsLoaderOutput = {
  data: TeamsResponse;
  error: string | null;
}

export const teamsLoader = async (): Promise<TeamsLoaderOutput> => {
  const result = await handleLoaderApiCall(
    () => getTeams(),
    "Failed to load teams",
    {} as TeamsResponse
  );

  if (result.error) {
    throw new Response(result.error, {status: result.statusCode});
  }

  return {data: result.data, error: result.error};
};
