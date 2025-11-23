import { SmallTalkResponse } from "../../models/small-talk-response.ts";

export const handleLoaderApiCall = async <T>(
  apiCall: () => Promise<SmallTalkResponse<T>>,
  errorMessage: string,
  fallbackData: T
): Promise<{ data: T; error: string | null, statusCode: number }> => {
  try {
    const response = await apiCall();
    const apiError = response.systemMessage?.isError ? response.systemMessage.messageText : null;
    return {data: response.data, error: apiError, statusCode: response.statusCode};
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : errorMessage;
    return {data: fallbackData, error: message, statusCode: 500};
  }
};

export const extractIdFromUrl = (request: Request) => {
  const url = new URL(request.url);
  const pathSegments = url.pathname.split("/");
  return pathSegments[pathSegments.length - 1];
}