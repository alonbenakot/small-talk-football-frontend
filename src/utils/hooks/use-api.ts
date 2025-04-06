import { Dispatch, SetStateAction, useCallback, useState } from "react";
import axios from "axios";
import { SmallTalkResponse } from "../../models/small-talk-response.ts";

type UseApiResponse<T, P> = {
  fetchedData: SmallTalkResponse<T> | null;
  isLoading: boolean;
  error: string | null;
  setFetchedData: Dispatch<SetStateAction<SmallTalkResponse<T> | null>>;
  invokeApi: (input: P) => Promise<void>;
};

const useApi = <T, P>(
  fetchMethod: (input: P) => Promise<SmallTalkResponse<T>>,
  initialDataValue?: SmallTalkResponse<T>,
): UseApiResponse<T, P> => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedData, setFetchedData] = useState<SmallTalkResponse<T> | null>(initialDataValue ?? null);

  const fetchData = useCallback(async (input: P) => {
    setIsLoading(true);
    setError(null);

    try {
      const response: SmallTalkResponse<T> = await fetchMethod(input);
      setFetchedData(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.systemMessage?.messageText || error.message || "Failed to fetch data.");
      } else {
        setError("Failed to fetch data.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchMethod]);

  return {fetchedData, setFetchedData, isLoading, error, invokeApi: fetchData};
};

export default useApi;
