import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import axios from "axios";

type UseApiResponse<T> = {
  fetchedData: T | null;
  isLoading: boolean;
  error: string | null;
  setFetchedData: Dispatch<SetStateAction<T | null>>;
  triggerApi: () => Promise<void>;
};

const useApi = <T>(
  fetchMethod: () => Promise<T>,
  initialDataValue?: T,
  shouldFetchInitially: boolean = true
): UseApiResponse<T> => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedData, setFetchedData] = useState<T | null>(initialDataValue ?? null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchMethod();
      setFetchedData(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || error.message || "Failed to fetch data.");
      } else {
        setError("Failed to fetch data.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchMethod]);

  useEffect(() => {
    if (shouldFetchInitially) {
      fetchData();
    }
  }, [shouldFetchInitially, fetchData]);

  return {fetchedData, setFetchedData, isLoading, error, triggerApi: fetchData};
};

export default useApi;
