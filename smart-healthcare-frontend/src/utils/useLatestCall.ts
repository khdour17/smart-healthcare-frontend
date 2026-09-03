import {
  useCallback,
  useRef,
} from 'react';

export function useLatestCall(): () => () => boolean {
  const latestCall = useRef(0);

  return useCallback(() => {
    latestCall.current += 1;
    const call = latestCall.current;

    return () => latestCall.current === call;
  }, []);
}
