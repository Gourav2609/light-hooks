import { useCallback, useEffect, useState } from "react";

/** Configuration options for the usePing hook */
export interface PingOptions {
  /** The URL to ping for latency measurement */
  url: string;
  /** Interval between automatic pings in milliseconds (default: 5000ms) */
  interval?: number;
  /** Latency value to show when the endpoint is unreachable (default: 0ms) */
  fallbackLatency?: number;
  /** Whether to start pinging automatically when the hook is initialized (default: true) */
  autoStart?: boolean;
}

/** Return values from the usePing hook */
export interface PingResult {
  /** Manual ping function to trigger a ping immediately */
  ping: () => void;
  /** Current latency in milliseconds, or fallbackLatency if unreachable */
  latency: number;
  /** Whether the endpoint is currently reachable */
  isLive: boolean;
  /** Whether a ping request is currently in progress */
  isLoading: boolean;
  /** Timestamp of the last ping attempt, null if no pings have been made */
  lastPingTime: Date | null;
}

/**
 * Measures network latency to a specific URL using a HEAD request.
 * Returns -1 if the request fails or the response is not ok.
 *
 * @param url - The URL to ping
 * @returns Promise that resolves to latency in milliseconds, or -1 if failed
 */
const getLatency = async (url: string): Promise<number> => {
  try {
    const now = performance.now();
    const response = await fetch(url, {
      method: "HEAD", // Use HEAD to minimize data transfer
      cache: "no-cache", // Ensure fresh request for accurate timing
    });

    if (response.ok) {
      return Math.round(performance.now() - now);
    } else {
      return -1; // Server responded but with error status
    }
  } catch (error) {
    return -1; // Network error or request failed
  }
};

/**
 * A React hook for monitoring network connectivity and measuring latency to specific URLs.
 * Provides real-time ping functionality with automatic or manual operation modes.
 *
 * @param options - Configuration object or URL string
 *   - If string: Uses the string as URL with default options
 *   - If object: Full configuration with url, interval, fallbackLatency, and autoStart
 *
 * @returns PingResult object containing:
 *   - ping: Function to manually trigger a ping
 *   - latency: Current latency in milliseconds
 *   - isLive: Boolean indicating if endpoint is reachable
 *   - isLoading: Boolean indicating if a ping is in progress
 *   - lastPingTime: Date of last ping attempt
 *
 * @example
 * // Simple usage with URL string
 * const { latency, isLive } = usePing("https://api.example.com");
 *
 * @example
 * // Advanced usage with full configuration
 * const { ping, latency, isLive, isLoading } = usePing({
 *   url: "https://api.example.com",
 *   interval: 3000,          // Ping every 3 seconds
 *   fallbackLatency: 999,    // Show 999ms when offline
 *   autoStart: false         // Manual mode
 * });
 *
 * @example
 * // Manual ping control
 * const { ping, isLoading } = usePing({
 *   url: "https://api.example.com",
 *   autoStart: false
 * });
 *
 * const handlePing = () => {
 *   if (!isLoading) {
 *     ping();
 *   }
 * };
 */
export const usePing = (options: PingOptions | string): PingResult => {
  // Normalize options - accept either string URL or full config object
  if (typeof options === "string") {
    options = { url: options };
  }
  const {
    url,
    interval = 5000, // Default 5 second intervals
    fallbackLatency = 0, // Default to 0ms when offline
    autoStart = true, // Default to automatic pinging
  } = options;
  // State management for ping results and status
  const [latency, setLatency] = useState<number>(fallbackLatency);
  const [isLive, setLive] = useState(autoStart); // Assume live initially if autoStart is true
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastPingTime, setLastPingTime] = useState<Date | null>(null);

  // Process a single ping attempt and update state accordingly
  const processLatency = useCallback(async () => {
    setIsLoading(true);
    const latency = await getLatency(url);

    if (latency === -1) {
      // Ping failed - endpoint is unreachable
      setLive(false);
      setLatency(fallbackLatency);
    } else {
      // Ping succeeded - endpoint is reachable
      setLive(true);
      setLatency(latency);
    }

    setLastPingTime(new Date());
    setIsLoading(false);
  }, [fallbackLatency, url]);

  // Manual ping function that can be called by consumers
  const ping = useCallback(() => {
    processLatency();
  }, [processLatency]);

  // Set up automatic pinging if autoStart is enabled
  useEffect(() => {
    if (!autoStart) {
      // Clean up any existing state when autoStart is false
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Set up interval for regular pings
    const pingInterval = setInterval(async () => {
      await processLatency();
    }, interval);

    // Perform initial ping immediately
    (async () => {
      await processLatency();
    })();

    // Cleanup interval when component unmounts or dependencies change
    return () => {
      clearInterval(pingInterval);
      setIsLoading(false);
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
