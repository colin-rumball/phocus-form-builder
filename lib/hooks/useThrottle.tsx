import { useCallback, useEffect, useRef, useState } from "react";

function useThrottle<T>(fn: (args?: T) => Promise<unknown>, delay: number) {
  // const [throttled, setThrottled] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimeoutAndReset = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimeoutAndReset();
  }, []);

  const callback = useCallback(
    async (args?: T) => {
      if (!timerRef.current) {
        void fn(args);
        timerRef.current = setTimeout(() => {
          clearTimeoutAndReset();
        }, delay);
      } else {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          void fn(args);
          clearTimeoutAndReset();
        }, delay);
      }
    },
    [fn, delay],
  );

  return callback;
}

export default useThrottle;
