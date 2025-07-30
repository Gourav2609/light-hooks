import { useCallback, useEffect, useState } from "react";

export interface PingOptions {
  url: string;
  interval?: number;
  fallbackLatency?: number;
  autoStart?: boolean;
}

export interface PingResult {
  ping: () => void;
  latency: number;
  isLive: boolean;
  isLoading: boolean;
  lastPingTime: Date | null;
}

const getLatency = async (url: string): Promise<number> => {
  try {
    const now = performance.now();
    const response = await fetch(url, {
      method: "HEAD",
      cache: "no-cache",
    });

    if (response.ok) {
      return Math.round(performance.now() - now);
    } else {
      return -1;
    }
  } catch (error) {
    return -1;
  }
};

export const usePing = (options: PingOptions | string): PingResult => {
  if (typeof options === "string") {
    options = { url: options };
  }
  const {
    url,
    interval = 5000,
    fallbackLatency = 0,
    autoStart = true,
  } = options;
  const [latency, setLatency] = useState<number>(fallbackLatency);
  const [isLive, setLive] = useState(autoStart);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastPingTime, setLastPingTime] = useState<Date | null>(null);

  const processLatency = useCallback(async () => {
    setIsLoading(true);
    const latency = await getLatency(url);
    if (latency === -1) {
      setLive(false);
      setLatency(fallbackLatency);
    } else {
      setLive(true);
      setLatency(latency);
    }
    setLastPingTime(new Date());
    setIsLoading(false);
  }, [fallbackLatency, url]);

  const ping = useCallback(() => {
    processLatency();
  }, [processLatency]);

  useEffect(() => {
    if (!autoStart) return;
    setIsLoading(true);
    const pingInterval = setInterval(async () => {
      await processLatency();
    }, interval);

    (async () => {
      await processLatency();
    })();

    return () => {
      clearInterval(pingInterval);
    };
  }, [processLatency, interval, autoStart]);

  return {
    ping,
    latency,
    isLive,
    isLoading,
    lastPingTime,
  };
};
