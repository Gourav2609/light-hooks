import { useCallback, useEffect, useState } from 'react';

/**
 * Configuration options for the useGeolocation hook
 */
export interface UseGeolocationOptions extends PositionOptions {
  /**
   * Whether to watch for position changes continuously
   * @default false
   */
  watch?: boolean;
  /**
   * Whether to request location immediately when the hook mounts
   * @default true
   */
  immediate?: boolean;
}

/**
 * Geolocation position data
 */
export interface GeolocationCoordinates {
  /** Current latitude */
  latitude: number;
  /** Current longitude */
  longitude: number;
  /** Accuracy of the position in meters */
  accuracy: number;
  /** Altitude in meters (null if not available) */
  altitude: number | null;
  /** Accuracy of the altitude in meters (null if not available) */
  altitudeAccuracy: number | null;
  /** Direction of travel in degrees (null if not available) */
  heading: number | null;
  /** Speed in meters per second (null if not available) */
  speed: number | null;
  /** Timestamp when the position was acquired */
  timestamp: number;
}

/**
 * Return values from the useGeolocation hook
 */
export interface UseGeolocationReturn {
  /** Current position data (null if not available) */
  position: GeolocationCoordinates | null;
  /** Current error (null if no error) */
  error: GeolocationPositionError | null;
  /** Whether a location request is currently in progress */
  loading: boolean;
  /** Whether geolocation is supported by the browser */
  supported: boolean;
  /** Function to manually request current position */
  getCurrentPosition: () => void;
  /** Function to start watching position changes */
  startWatching: () => void;
  /** Function to stop watching position changes */
  stopWatching: () => void;
}

/**
 * A React hook for accessing the user's geolocation with comprehensive error handling
 * 
 * This hook provides access to the browser's Geolocation API with support for both
 * one-time position requests and continuous position watching. It handles permissions,
 * errors, and provides loading states.
 * 
 * @param options - Configuration options for geolocation behavior
 * @returns Object containing position data, error state, and control functions
 * 
 * @example
 * ```tsx
 * import { useGeolocation } from 'light-hooks';
 * 
 * function LocationComponent() {
 *   const { position, error, loading, getCurrentPosition } = useGeolocation({
 *     enableHighAccuracy: true,
 *     timeout: 10000,
 *     maximumAge: 60000
 *   });
 * 
 *   if (loading) return <div>Getting location...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!position) return <div>No location available</div>;
 * 
 *   return (
 *     <div>
 *       <p>Latitude: {position.latitude}</p>
 *       <p>Longitude: {position.longitude}</p>
 *       <p>Accuracy: {position.accuracy} meters</p>
 *       <button onClick={getCurrentPosition}>Refresh Location</button>
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // Watch position changes continuously
 * const { position, startWatching, stopWatching } = useGeolocation({
 *   watch: true,
 *   enableHighAccuracy: true
 * });
 * 
 * // Manual control
 * const { getCurrentPosition } = useGeolocation({
 *   immediate: false
 * });
 * ```
 */
export const useGeolocation = (
  options: UseGeolocationOptions = {}
): UseGeolocationReturn => {
  const {
    watch = false,
    immediate = true,
    enableHighAccuracy = false,
    timeout = 15000,
    maximumAge = 0,
    ...positionOptions
  } = options;

  const [position, setPosition] = useState<GeolocationCoordinates | null>(null);
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const [loading, setLoading] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  // Check if geolocation is supported
  const supported = typeof navigator !== 'undefined' && 'geolocation' in navigator;

  // Create position options object
  const geoOptions: PositionOptions = {
    enableHighAccuracy,
    timeout,
    maximumAge,
    ...positionOptions,
  };

  // Success callback
  const onSuccess = useCallback((pos: GeolocationPosition) => {
    const {
      latitude,
      longitude,
      accuracy,
      altitude,
      altitudeAccuracy,
      heading,
      speed,
    } = pos.coords;

    setPosition({
      latitude,
      longitude,
      accuracy,
      altitude,
      altitudeAccuracy,
      heading,
      speed,
      timestamp: pos.timestamp,
    });
    setError(null);
    setLoading(false);
  }, []);

  // Error callback
  const onError = useCallback((err: GeolocationPositionError) => {
    setError(err);
    setLoading(false);
  }, []);

  // Get current position once
  const getCurrentPosition = useCallback(() => {
    if (!supported) {
      setError({
        code: 0,
        message: 'Geolocation is not supported by this browser',
      } as GeolocationPositionError);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(onSuccess, onError, geoOptions);
  }, [supported, onSuccess, onError, geoOptions]);

  // Start watching position
  const startWatching = useCallback(() => {
    if (!supported) {
      setError({
        code: 0,
        message: 'Geolocation is not supported by this browser',
      } as GeolocationPositionError);
      return;
    }

    if (watchId !== null) {
      return; // Already watching
    }

    setLoading(true);
    setError(null);

    const id = navigator.geolocation.watchPosition(onSuccess, onError, geoOptions);
    setWatchId(id);
  }, [supported, watchId, onSuccess, onError, geoOptions]);

  // Stop watching position
  const stopWatching = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setLoading(false);
    }
  }, [watchId]);

  // Effect for immediate position request
  useEffect(() => {
    if (immediate && !watch) {
      getCurrentPosition();
    }
  }, [immediate, watch, getCurrentPosition]);

  // Effect for watching position
  useEffect(() => {
    if (watch) {
      startWatching();
    } else {
      stopWatching();
    }

    return () => {
      stopWatching();
    };
  }, [watch, startWatching, stopWatching]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return {
    position,
    error,
    loading,
    supported,
    getCurrentPosition,
    startWatching,
    stopWatching,
  };
};

export default useGeolocation;
