import {
  useCallback,
  useEffect,
  useState,
} from 'react';

interface LoadedData<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  reload: () => void;
}

export function useLoadedData<T>(load: (() => Promise<T>) | null, errorMessage: string): LoadedData<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    if (load === null) return;
    load()
      .then((loaded) => {
        setData(loaded);
        setError(null);
      })
      .catch(() => setError(errorMessage))
      .finally(() => setIsLoading(false));
  }, [load, errorMessage]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, isLoading, error, reload };
}
