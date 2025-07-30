import { useCallback, useEffect, useRef } from "react";

/** Modifier keys that can be combined with other keys */
type ModifierKey = "ctrl" | "alt" | "shift" | "meta";

/** Special non-printable keys */
type SpecialKey =
  | "Escape"
  | "Enter"
  | "Tab"
  | "Backspace"
  | "Delete"
  | "Space"
  | "ArrowUp"
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight"
  | "Home"
  | "End"
  | "PageUp"
  | "PageDown"
  | "Insert";

/** Function keys F1 through F12 */
type FunctionKey =
  | "F1"
  | "F2"
  | "F3"
  | "F4"
  | "F5"
  | "F6"
  | "F7"
  | "F8"
  | "F9"
  | "F10"
  | "F11"
  | "F12";

/** Lowercase alphabet keys a-z */
type AlphabetKey =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z";

/** Numeric keys 0-9 */
type NumericKey = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

/** Symbol and punctuation keys */
type SymbolKey =
  | "!"
  | "@"
  | "#"
  | "$"
  | "%"
  | "^"
  | "&"
  | "*"
  | "("
  | ")"
  | "-"
  | "_"
  | "="
  | "+"
  | "["
  | "]"
  | "{"
  | "}"
  | ";"
  | ":"
  | "'"
  | '"'
  | ","
  | "."
  | "/"
  | "<"
  | ">"
  | "?"
  | "\\"
  | "|"
  | "`"
  | "~";

/** Union of all supported key types */
type HotKey = SpecialKey | FunctionKey | AlphabetKey | NumericKey | SymbolKey;

export interface HotKeyConfig {
  /** The main key to listen for (e.g., 'a', 'Enter', 'F1') */
  key: HotKey;
  /** Optional modifier keys that must be pressed along with the main key (e.g., ['ctrl', 'shift']) */
  modifiers?: ModifierKey[];
  /** Whether to prevent the default browser behavior for this specific hotkey */
  preventDefault?: boolean;
  /** Whether to stop event propagation for this specific hotkey */
  stopPropagation?: boolean;
}

export interface UseHotKeyOptions {
  /** Whether the hotkey listener is active (default: true) */
  enabled?: boolean;
  /** Global setting to prevent default browser behavior for all hotkeys */
  preventDefault?: boolean;
  /** Global setting to stop event propagation for all hotkeys */
  stopPropagation?: boolean;
  /** The DOM element to attach the event listeners to (default: document) */
  target?: HTMLElement | Document;
  /** Whether to ignore hotkeys when user is typing in input fields (default: true) */
  ignoreInputFields?: boolean;
}


/**
 * Keymap to normalize key names to handle browser inconsistencies and provide
 * a consistent interface for key matching
 */
const keyMap: Record<string, string> = {
  " ": "Space", // Space character to "Space" string
  Control: "ctrl", // Normalize "Control" to lowercase "ctrl"
  Alt: "alt", // Normalize "Alt" to lowercase "alt"
  Shift: "shift", // Normalize "Shift" to lowercase "shift"
  Meta: "meta", // Normalize "Meta" to lowercase "meta"
  Cmd: "meta", // Map "Cmd" to "meta" for consistency
  Command: "meta", // Map "Command" to "meta" for consistency
};

/**
 * Normalizes key names to handle browser inconsistencies and provide
 * a consistent interface for key matching
 */
const normalizeKey = (key: string): string => {
  return keyMap[key] || key.toLowerCase();
};

/**
 * Checks if the event target is an input field where users typically type text.
 * This helps prevent hotkey conflicts when users are filling out forms.
 */
const isInputField = (target: EventTarget | null): boolean => {
  if (!target || !(target instanceof HTMLElement)) return false;

  // List of HTML elements that accept text input
  const inputTypes = ["input", "textarea", "select"];
  const tagName = target.tagName.toLowerCase();

  return (
    inputTypes.includes(tagName) || // Standard input elements
    target.contentEditable === "true" || // Elements with contenteditable="true"
    target.hasAttribute("contenteditable") // Elements with contenteditable attribute
  );
};

/**
 * Determines if a keyboard event matches a specific hotkey configuration.
 * Handles both simple key strings and complex key combinations with modifiers.
 */
const matchesHotKey = (
  event: KeyboardEvent,
  config: HotKeyConfig | HotKey
): boolean => {
  if (typeof config === "string") {
    // Simple key match - just compare the normalized key names
    const normalizedEventKey = normalizeKey(event.key);
    const normalizedConfigKey = normalizeKey(config);
    return normalizedEventKey === normalizedConfigKey;
  }

  // Complex key combination match with modifiers
  const { key, modifiers = [] } = config;

  // First, check if the main key matches
  const normalizedEventKey = normalizeKey(event.key);
  const normalizedConfigKey = normalizeKey(key);

  if (normalizedEventKey !== normalizedConfigKey) {
    return false;
  }

  // Then, check if the modifier keys match exactly
  const requiredModifiers = new Set(modifiers);
  const pressedModifiers = new Set();

  // Build a set of currently pressed modifier keys
  if (event.ctrlKey) pressedModifiers.add("ctrl");
  if (event.altKey) pressedModifiers.add("alt");
  if (event.shiftKey) pressedModifiers.add("shift");
  if (event.metaKey) pressedModifiers.add("meta");

  // Check if all required modifiers are pressed and no extra ones
  // This ensures exact matches (e.g., Ctrl+S won't match Ctrl+Shift+S)
  if (requiredModifiers.size !== pressedModifiers.size) {
    return false;
  }

  // Verify that every required modifier is actually pressed
  for (const modifier of requiredModifiers) {
    if (!pressedModifiers.has(modifier)) {
      return false;
    }
  }

  return true;
};

/**
 * A React hook for handling keyboard shortcuts and hotkey combinations
 *
 * @param hotKeyConfig - The hotkey configuration(s) to listen for. Can be:
 *   - A simple key string (e.g., 'Enter', 'a', 'F1')
 *   - A HotKeyConfig object with modifiers and options
 *   - An array of either type for multiple hotkey combinations
 *
 * @param callback - Function called when the hotkey is triggered. Receives the KeyboardEvent.
 *
 * @param options - Optional configuration object:
 *   - enabled: Whether the hotkey listener is active (default: true)
 *   - preventDefault: Global setting to prevent default browser behavior
 *   - stopPropagation: Global setting to stop event propagation
 *   - target: DOM element to attach listeners to (default: document)
 *   - ignoreInputFields: Whether to ignore hotkeys in input fields (default: true)
 *
 * @returns boolean indicating if hotkey is currently pressed
 *
 * @example
 * // Simple key binding
 * useHotKey('Enter', () => console.log('Enter pressed!'));
 *
 * @example
 * // Key combination with modifiers
 * useHotKey(
 *   { key: 's', modifiers: ['ctrl'], preventDefault: true },
 *   () => console.log('Save action!')
 * );
 *
 * @example
 * // Multiple hotkey combinations
 * useHotKey([
 *   { key: 'c', modifiers: ['ctrl'] },
 *   { key: 'c', modifiers: ['meta'] }
 * ], () => console.log('Copy action!'));
 */
export const useHotKey = (
  hotKeyConfig: HotKeyConfig | HotKey | (HotKeyConfig | HotKey)[],
  callback: () => void,
  options: UseHotKeyOptions = {}
): boolean => {
  // Destructure options with defaults
  const {
    enabled = true, // Enable/disable the entire hotkey functionality
    preventDefault = false, // Global preventDefault setting for all hotkeys
    stopPropagation = false, // Global stopPropagation setting for all hotkeys
    target = document, // DOM element to listen on (document by default)
    ignoreInputFields = true, // Ignore hotkeys when typing in input fields
  } = options;

  // Store callback and config in refs to avoid unnecessary re-renders
  // and ensure we always have the latest values without adding them to dependencies
  const callbackRef = useRef(callback);
  const configRef = useRef(hotKeyConfig);
  const isPressedRef = useRef(false);

  // Update refs when values change to ensure we use the latest callback and config
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    configRef.current = hotKeyConfig;
  }, [hotKeyConfig]);

  const handleKeyDown = useCallback(
    (event: Event) => {
      // Exit early if the hotkey functionality is disabled
      if (!enabled) return;

      const keyboardEvent = event as KeyboardEvent;

      // Skip hotkey processing if user is typing in input fields and ignoreInputFields is true
      // This prevents accidental hotkey triggers while filling forms
      if (ignoreInputFields && isInputField(keyboardEvent.target)) {
        return;
      }

      // Normalize config to always be an array for consistent processing
      const configs = Array.isArray(configRef.current)
        ? configRef.current
        : [configRef.current];

      // Check each configuration to see if the current key event matches
      for (const config of configs) {
        if (matchesHotKey(keyboardEvent, config)) {
          // Determine whether to prevent default behavior
          // Individual config setting takes precedence over global setting
          const shouldPreventDefault =
            typeof config === "object"
              ? config.preventDefault ?? preventDefault // Use config-specific setting if available
              : preventDefault; // Fall back to global setting for simple string configs

          // Determine whether to stop event propagation
          // Individual config setting takes precedence over global setting
          const shouldStopPropagation =
            typeof config === "object"
              ? config.stopPropagation ?? stopPropagation // Use config-specific setting if available
              : stopPropagation; // Fall back to global setting for simple string configs

          // Apply preventDefault if configured to do so
          if (shouldPreventDefault) {
            keyboardEvent.preventDefault();
          }

          // Apply stopPropagation if configured to do so
          if (shouldStopPropagation) {
            keyboardEvent.stopPropagation();
          }

          // Update pressed state and trigger the callback
          isPressedRef.current = true;
          callbackRef.current();
          break; // Exit loop after first match to avoid duplicate calls
        }
      }
    },
    [enabled, preventDefault, stopPropagation, ignoreInputFields]
  );

  // Handle key release to reset the pressed state
  const handleKeyUp = useCallback(() => {
    isPressedRef.current = false;
  }, []);

  // Set up and clean up event listeners
  useEffect(() => {
    // Don't attach listeners if functionality is disabled
    if (!enabled) return;

    // Use the target element (document by default, but can be a specific element)
    const targetElement = target instanceof HTMLElement ? target : target;

    // Attach event listeners for keydown and keyup
    targetElement.addEventListener("keydown", handleKeyDown);
    targetElement.addEventListener("keyup", handleKeyUp);

    // Cleanup function to remove event listeners when component unmounts
    // or when dependencies change
    return () => {
      targetElement.removeEventListener("keydown", handleKeyDown);
      targetElement.removeEventListener("keyup", handleKeyUp);
    };
  }, [enabled, target, handleKeyDown, handleKeyUp]);

  return isPressedRef.current;

};
