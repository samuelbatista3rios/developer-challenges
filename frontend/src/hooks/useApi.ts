
import { useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';

type ApiFunction<T, Args extends unknown[]> = (...args: Args) => Promise<T>;

interface UseApiOptions {
  showSuccess?: boolean;
  successMessage?: string;
  showError?: boolean;
}

interface UseApiReturn<T, Args extends unknown[]> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: Args) => Promise<T | null>;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
}

export const useApi = <T, Args extends unknown[] = []>(
  apiFunction: ApiFunction<T, Args>,
  options: UseApiOptions = {}
): UseApiReturn<T, Args> => {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunction(...args);
        setData(result);

        if (options.showSuccess && options.successMessage) {
          enqueueSnackbar(options.successMessage, { variant: 'success' });
        }

        return result;
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);

        if (options.showError !== false) {
          enqueueSnackbar(errorMessage, { variant: 'error' });
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, options, enqueueSnackbar]
  );

  return {
    data,
    loading,
    error,
    execute,
    setData
  };
};