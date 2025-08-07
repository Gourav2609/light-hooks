import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * HTTP methods supported by useFetch
 */
export type FetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

/**
 * Configuration options for the useFetch hook
 */
export interface UseFetchOptions<T = any> {
  /**
   * HTTP method to use
   * @default 'GET'
   */
  method?: FetchMethod;
  /**
   * Request body data
   */
  body?: any;
  /**
   * Whether to automatically execute the request on mount
   * @default true
   */
  immediate?: boolean;
  /**
   * Function to transform response data
   */
  transform?: (data: any) => T;
  /**
   * Retry configuration
   */
  retry?: {
    /** Number of retry attempts */
    attempts?: number;
    /** Delay between retries in milliseconds */
    delay?: number;
    /** Whether to retry on specific status codes */
    retryOn?: number[];
  };
  /**
   * Custom cache configuration (separate from browser cache)
   */
  customCache?: {
    /** Cache key for storing response */
    key?: string;
    /** Cache duration in milliseconds */
    ttl?: number;
  };
  /**
   * Request timeout in milliseconds
   * @default 10000
   */
  timeout?: number;
  /**
   * Dependencies that trigger a refetch when changed
   */
  deps?: any[];
  /**
   * Additional fetch options (headers, credentials, etc.)
   */
  fetchOptions?: Omit<RequestInit, 'method' | 'body'>;
}

/**
 * Return values from the useFetch hook
 */
export interface UseFetchReturn<T> {
  /** The response data */
  data: T | null;
  /** Loading state */
  loading: boolean;
  /** Error object if request failed */
  error: Error | null;
  /** HTTP response object */
  response: Response | null;
  /** Function to manually trigger the request */
  execute: (overrideOptions?: Partial<UseFetchOptions<T>>) => Promise<T | null>;
  /** Function to abort the current request */
  abort: () => void;
  /** Function to reset the state */
  reset: () => void;
  /** Whether the request was aborted */
  aborted: boolean;
}

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

/**
 * A comprehensive React hook for data fetching with advanced features
 * 
 * This hook provides a complete solution for HTTP requests with loading states,
 * error handling, retries, caching, and request cancellation.
 * 
 * @param url - The URL to fetch from
 * @param options - Configuration options for the request
 * @returns Object containing data, loading state, and control functions
 * 
 * @example
 * ```tsx
 * import { useFetch } from 'light-hooks';
 * 
 * function UserProfile({ userId }: { userId: string }) {
 *   const { data: user, loading, error, execute } = useFetch<User>(
 *     `https://api.example.com/users/${userId}`,
 *     {
 *       immediate: true,
 *       cache: { key: `user-${userId}`, ttl: 300000 }, // 5 minutes
 *       retry: { attempts: 3, delay: 1000 }
 *     }
 *   );
 * 
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!user) return <div>No user found</div>;
 * 
 *   return (
 *     <div>
 *       <h1>{user.name}</h1>
 *       <button onClick={() => execute()}>Refresh</button>
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // POST request with body
 * const { execute: createUser, loading } = useFetch<User>(
 *   'https://api.example.com/users',
 *   {
 *     method: 'POST',
 *     immediate: false,
 *     headers: { 'Content-Type': 'application/json' }
 *   }
 * );
 * 
 * const handleSubmit = async (userData: CreateUserData) => {
 *   await createUser({ body: JSON.stringify(userData) });
 * };
 * ```
 * 
 * @example
 * ```tsx
 * // With dependencies that trigger refetch
 * const { data, loading } = useFetch(
 *   `https://api.example.com/search?q=${query}`,
 *   {
 *     deps: [query],
 *     transform: (data) => data.results
 *   }
 * );
 * ```
 */
export const useFetch = <T = any>(
  url: string,
  options: UseFetchOptions<T> = {}
): UseFetchReturn<T> => {
  const {
    method = 'GET',
    body,
    immediate = true,
    transform,
    retry = { attempts: 0, delay: 1000, retryOn: [500, 502, 503, 504] },
    customCache: cacheConfig,
    timeout = 10000,
    deps = [],
    fetchOptions = {},
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<Response | null>(null);
  const [aborted, setAborted] = useState(false);

  const abortControllerRef = useRef<AbortController>();
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Check cache
  const getCachedData = useCallback((cacheKey: string) => {
    if (!cacheConfig?.key) return null;
    
    const cached = cache.get(cacheKey);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      cache.delete(cacheKey);
      return null;
    }
    
    return cached.data;
  }, [cacheConfig?.key]);

  // Set cache
  const setCachedData = useCallback((cacheKey: string, data: any) => {
    if (!cacheConfig?.key || !cacheConfig?.ttl) return;
    
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl: cacheConfig.ttl,
    });
  }, [cacheConfig?.key, cacheConfig?.ttl]);

  // Abort current request
  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setAborted(true);
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setResponse(null);
    setLoading(false);
    setAborted(false);
  }, []);

  // Execute request with retry logic
  const executeWithRetry = useCallback(
    async (requestOptions: RequestInit, attemptNumber = 0): Promise<T | null> => {
      try {
        const controller = new AbortController();
        abortControllerRef.current = controller;

        // Set up timeout
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // Check if we should retry
          const shouldRetry =
            attemptNumber < (retry.attempts || 0) &&
            (retry.retryOn?.includes(response.status) || false);

          if (shouldRetry) {
            return new Promise((resolve, reject) => {
              retryTimeoutRef.current = setTimeout(() => {
                executeWithRetry(requestOptions, attemptNumber + 1)
                  .then(resolve)
                  .catch(reject);
              }, retry.delay || 1000);
            });
          }

          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        setResponse(response);

        // Parse response data
        const contentType = response.headers.get('content-type');
        let responseData: any;

        if (contentType?.includes('application/json')) {
          responseData = await response.json();
        } else if (contentType?.includes('text/')) {
          responseData = await response.text();
        } else {
          responseData = await response.blob();
        }

        // Transform data if transformer provided
        const finalData = transform ? transform(responseData) : responseData;

        // Cache the data
        if (cacheConfig?.key) {
          setCachedData(cacheConfig.key, finalData);
        }

        setData(finalData);
        setError(null);
        return finalData;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          setAborted(true);
          return null;
        }

        // Check if we should retry on error
        const shouldRetry = attemptNumber < (retry.attempts || 0);
        if (shouldRetry) {
          return new Promise((resolve, reject) => {
            retryTimeoutRef.current = setTimeout(() => {
              executeWithRetry(requestOptions, attemptNumber + 1)
                .then(resolve)
                .catch(reject);
            }, retry.delay || 1000);
          });
        }

        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        throw error;
      }
    },
    [url, transform, retry, timeout, cacheConfig?.key, setCachedData]
  );

  // Main execute function
  const execute = useCallback(
    async (overrideOptions: Partial<UseFetchOptions<T>> = {}): Promise<T | null> => {
      const mergedOptions = { ...options, ...overrideOptions };
      
      // Check cache first
      if (cacheConfig?.key) {
        const cachedData = getCachedData(cacheConfig.key);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          setError(null);
          return cachedData;
        }
      }

      setLoading(true);
      setError(null);
      setAborted(false);

      const requestOptions: RequestInit = {
        method: mergedOptions.method || method,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
          ...(mergedOptions.fetchOptions?.headers || {}),
        },
        ...fetchOptions,
        ...(mergedOptions.fetchOptions || {}),
      };

      // Add body if provided
      if (mergedOptions.body || body) {
        requestOptions.body = mergedOptions.body || body;
      }

      try {
        const result = await executeWithRetry(requestOptions);
        return result;
      } catch (err) {
        return null;
      } finally {
        setLoading(false);
      }
    },
    [options, method, body, fetchOptions, cacheConfig?.key, getCachedData, executeWithRetry]
  );

  // Execute on mount if immediate is true
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  // Execute when dependencies change
  useEffect(() => {
    if (deps.length > 0 && !immediate) {
      execute();
    }
  }, deps);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abort();
    };
  }, [abort]);

  return {
    data,
    loading,
    error,
    response,
    execute,
    abort,
    reset,
    aborted,
  };
};

export default useFetch;
