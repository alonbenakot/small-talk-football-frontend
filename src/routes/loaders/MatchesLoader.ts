import FixturesResponse from "../../components/features/matches/models/FixturesResponse.ts";
import { handleLoaderApiCall } from "../../utils/api/api-utils.ts";
import { getFixtures } from "../../utils/api/http.ts";

export type MatchesLoaderOutput = {
  data: FixturesResponse;
  error: string | null;
}

export const matchesLoader = async (): Promise<MatchesLoaderOutput> => {
  const result = await handleLoaderApiCall(
    () => getFixtures(),
    "Failed to load matches",
    {} as FixturesResponse
  );

  if (result.error) {
    throw new Response(result.error, {status: result.statusCode});
  }

  return {data: result.data, error: result.error};
};