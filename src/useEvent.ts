import { useCallback, useEffect, useRef, useMemo } from "react";

/** Configuration for a single event listener */
export interface EventOptions {
  /** The event type to listen for (e.g., 'click', 'mouseover', 'keydown') */
  event: string;
  /** Target elements by tag name (e.g., 'button', 'div', 'input') */
  targetElements?: string | string[];
  /** Target elements by their ID attributes */
  ids?: string | string[];
  /** Optional callback specific to this event (overrides global callback) */
  callback?: (event: Event) => void;
  /** Additional options for addEventListener (capture, passive, once) */
  options?: AddEventListenerOptions;
}

/** Global configuration that serves as fallback for individual event options */
export interface EventGlobalConfig {
  /** Default target elements by tag name */
  targetElements?: string | string[];
  /** Default target elements by ID */
  ids?: string | string[];
  /** Default options for all event listeners */
  options?: AddEventListenerOptions;
}

/** Internal structure for tracking active event listeners */
interface ElementCallback {
  /** The event type being listened to */
  event: string;
  /** HTML elements that have this listener attached */
  elements: HTMLElement[];
  /** The callback function attached to these elements */
  callback: (event: Event) => void;
  /** Event listener options used */
  options?: AddEventListenerOptions;
}

/**
 * A powerful React hook for managing multiple event listeners with flexible targeting options.
 * Supports targeting elements by ID, tag name, or both, with automatic cleanup and re-binding.
 *
 * @param callback - Default callback function for all events (receives Event object)
 * @param eventOptions - Event configuration(s):
 *   - String: Simple event name (uses global config for targeting)
 *   - Object: Single event configuration with specific targeting
 *   - Array: Multiple event configurations
 * @param globalConfig - Global configuration that serves as fallback for individual events
 *
 * @example
 * // Simple event binding to all buttons
 * useEvent(
 *   (e) => console.log('Button clicked:', e.target),
 *   'click',
 *   { targetElements: 'button' }
 * );
 *
 * @example
 * // Multiple events with specific targeting
 * useEvent(
 *   (e) => console.log('Event:', e.type),
 *   [
 *     { event: 'click', ids: 'submit-btn' },
 *     { event: 'mouseover', targetElements: ['button', 'a'] }
 *   ],
 *   { targetElements: 'div' }
 * );
 *
 * @example
 * // Advanced configuration with options
 * useEvent(
 *   (e) => console.log('Captured event:', e),
 *   {
 *     event: 'scroll',
 *     targetElements: 'div',
 *     options: { passive: true }
 *   },
 *   {}
 * );
 */
export const useEvent = (
  callback: (event: Event) => void,
  eventOptions: EventOptions | EventOptions[] | string,
  globalConfig: EventGlobalConfig = {}
) => {
  // Use refs to store all values and avoid dependency issues
  const globalCallbackRef = useRef(callback);
  const eventOptionsRef = useRef(eventOptions);
  const globalConfigRef = useRef(globalConfig);
  const elementCallbacksRef = useRef<ElementCallback[]>([]);

  // Update refs when values change
  useEffect(() => {
    globalCallbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    eventOptionsRef.current = eventOptions;
  }, [eventOptions]);

  useEffect(() => {
    globalConfigRef.current = globalConfig;
  }, [globalConfig]);

  // Add event listeners based on current configurations
  const addEventListeners = useCallback(() => {
    // Remove any existing listeners first
    removeEventListeners();

    const newElementCallbacks: ElementCallback[] = [];

    // Normalize eventOptions to always be an array for consistent processing
    const currentEventOptions = eventOptionsRef.current;
    const currentGlobalConfig = globalConfigRef.current;

    let configs: EventOptions[] = [];
    if (typeof currentEventOptions === "string") {
      configs.push({ event: currentEventOptions });
    } else if (Array.isArray(currentEventOptions)) {
      configs = currentEventOptions;
    } else {
      configs = [currentEventOptions];
    }

    for (const config of configs) {
      // Use config-specific callback or fall back to global callback
      const configCallback = config.callback || globalCallbackRef.current;

      // Merge config with global defaults
      const configIds = config.ids ?? currentGlobalConfig.ids ?? [];
      const configTargetElements =
        config.targetElements ?? currentGlobalConfig.targetElements ?? [];
      const configOptions = {
        ...currentGlobalConfig.options,
        ...config.options,
      };

      // Collect elements by ID
      const idSet = new Set<HTMLElement>();
      const normalizedIds = Array.isArray(configIds) ? configIds : [configIds];
      normalizedIds.forEach((id: string) => {
        const element = document.getElementById(id);
        if (element) idSet.add(element);
      });

      // Collect elements by tag name
      const elementSet = new Set<HTMLElement>();
      const normalizedElements = Array.isArray(configTargetElements)
        ? configTargetElements
        : [configTargetElements];
      normalizedElements.forEach((tag: string) => {
        const elements = Array.from(
          document.getElementsByTagName(tag)
        ) as HTMLElement[];
        elements.forEach((element) => {
          elementSet.add(element);
        });
      });

      // Determine final element set based on intersection logic
      let elements: HTMLElement[] = [];
      if (idSet.size === 0 && elementSet.size === 0) {
        // No targeting specified, skip this config
        continue;
      } else if (idSet.size === 0) {
        // Only tag targeting
        elements = Array.from(elementSet);
      } else if (elementSet.size === 0) {
        // Only ID targeting
        elements = Array.from(idSet);
      } else {
        // Both specified - use intersection (elements that match both criteria)
        elements = Array.from(idSet).filter((element) =>
          elementSet.has(element)
        );
      }

      // Add event listeners to selected elements
      elements.forEach((element) => {
        element.addEventListener(config.event, configCallback, configOptions);
      });

      // Track this listener group for cleanup
      newElementCallbacks.push({
        elements,
        event: config.event,
        callback: configCallback,
        options: configOptions,
      });
    }

    elementCallbacksRef.current = newElementCallbacks;
  }, []);

  // Remove all active event listeners
  const removeEventListeners = useCallback(() => {
    elementCallbacksRef.current.forEach((listenerGroup: ElementCallback) => {
      const { event, elements, callback, options } = listenerGroup;
      elements.forEach((element: HTMLElement) => {
        element.removeEventListener(event, callback, options);
      });
    });
    elementCallbacksRef.current = [];
  }, []);

  // Update refs when props change and re-setup listeners
  useEffect(() => {
    eventOptionsRef.current = eventOptions;
    globalConfigRef.current = globalConfig;
    globalCallbackRef.current = callback;

    // Re-setup listeners when configuration changes
    addEventListeners();

    // Cleanup on unmount or config change
    return () => {
      removeEventListeners();
    };
  }, [
    eventOptions,
    globalConfig,
    callback,
    addEventListeners,
    removeEventListeners,
  ]);
};
