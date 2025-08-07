// Mobile detection hook
export {
  useIsMobile,
  isMobile, // Deprecated: use useIsMobile instead
  type UseIsMobileOptions,
  type IsMobileOptions, // Deprecated: use UseIsMobileOptions instead
} from "./useIsMobile";

// Click outside detection hook
export {
  useClickOutside,
  type UseClickOutsideOptions,
} from "./useClickOutside";

//Countdown hook
export {
  useCountdown,
  type UseCountdownOptions,
  type CountdownReturn,
} from "./useCountdown";

// Ping hook
export { usePing, type PingOptions, type PingResult } from "./usePing";

// Hotkey hook
export {
  useHotKey,
  type HotKeyConfig,
  type UseHotKeyOptions,
} from "./useHotKey";

// Event handler hook
export {
  useEvent,
  type EventOptions,
  type EventGlobalConfig,
} from "./useEvent";

// Permission hook
export {
  usePermission,
  type usePermissionOptions,
  type usePermissionResult,
} from "./usePermission";

// Scroll hook
export {
  useScroll,
  type ScrollOptions,
  type ScrollResult,
  type ScrollDirection,
} from "./useScroll";

// LocalStorage hook
export {
  useLocalStorage,
  type UseLocalStorageReturn,
  type UseLocalStorageOptions,
} from "./useLocalStorage";

// Debounce hook
export { useDebounce, type UseDebounceOptions } from "./useDebounce";

// Geolocation hook
export {
  useGeolocation,
  type UseGeolocationOptions,
  type UseGeolocationReturn,
  type GeolocationCoordinates,
} from "./useGeolocation";

// Idle detection hook
export { useIdle, type UseIdleOptions, type UseIdleReturn } from "./useIdle";

// Throttle hook
export {
  useThrottle,
  useThrottleCallback,
  type UseThrottleOptions,
  type UseThrottleCallbackReturn,
} from "./useThrottle";

// Fetch hook
export {
  useFetch,
  type UseFetchOptions,
  type UseFetchReturn,
  type FetchMethod,
} from "./useFetch";

// Toggle hook
export { useToggle, type UseToggleReturn } from "./useToggle";

// Copy to clipboard hook
export {
  useCopyToClipboard,
  type UseCopyToClipboardOptions,
  type UseCopyToClipboardReturn,
} from "./useCopyToClipboard";

// Polling hook
export {
  usePolling,
  type UsePollingOptions,
  type UsePollingResults,
} from "./usePolling";

// Future hooks will be exported here
