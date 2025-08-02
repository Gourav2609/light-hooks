// Mobile detection hook
export { isMobile, type IsMobileOptions } from "./isMobile";

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
export { useEvent, type EventOptions,type EventGlobalConfig } from "./useEvent";

// LocalStorage hook
export {
  useLocalStorage,
  type UseLocalStorageReturn,
  type UseLocalStorageOptions,
} from "./useLocalStorage";

// Future hooks will be exported here
// export { useDebounce } from './useDebounce';
