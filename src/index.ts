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


export {
  usePermission,
  type usePermissionOptions,
  type usePermissionResult,
} from "./usePermission";

// Future hooks will be exported here
// export { useLocalStorage } from './useLocalStorage';
// export { useDebounce } from './useDebounce';
