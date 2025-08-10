import { SmallTalkResponse } from "../../models/small-talk-response.ts";

export const handleLoaderApiCall = async <T>(
  apiCall: () => Promise<SmallTalkResponse<T>>,
  errorMessage: string,
  fallbackData: T
): Promise<{ data: T; error: string | null }> => {
  try {
    const response = await apiCall();
    const apiError = response.systemMessage?.isError ? response.systemMessage.messageText : null;
    return { data: response.data, error: apiError };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : errorMessage;
    return { data: fallbackData, error: message };
  }
};