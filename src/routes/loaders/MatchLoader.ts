import MatchModel from "../../components/features/matches/models/MatchModel.ts";
import { extractIdFromUrl, handleLoaderApiCall } from "../../utils/api/api-utils.ts";
import { getFixture } from "../../utils/api/http.ts";
import { LoaderFunctionArgs } from "react-router-dom";

export type MatchLoaderOutput = {
  data: MatchModel;
  error: string | null;
}

export const matchLoader = async ({ request }: LoaderFunctionArgs): Promise<MatchLoaderOutput> => {
  const result = await handleLoaderApiCall(
    () => getFixture(extractIdFromUrl(request)),
    "Failed to load match",
    {} as MatchModel
  );

  if (result.error) {
    throw new Response(result.error, {status: result.statusCode});
  }

  return {data: result.data, error: result.error};
};

