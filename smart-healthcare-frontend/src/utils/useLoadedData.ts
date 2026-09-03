import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useLatestCall } from './useLatestCall';

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

  const startCall = useLatestCall();

  const reload = useCallback(() => {
    if (load === null) return;
    const isLatestCall = startCall();
    load()
      .then((loaded) => {
        if (!isLatestCall()) return;
        setData(loaded);
        setError(null);
      })
      .catch(() => {
        if (isLatestCall()) setError(errorMessage);
      })
      .finally(() => {
        if (isLatestCall()) setIsLoading(false);
      });
  }, [load, errorMessage, startCall]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, isLoading, error, reload };
}
