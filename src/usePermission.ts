import { useCallback, useEffect, useRef, useState } from "react";

/** Union type for permission inputs */
type PermissionType = PermissionName | PermissionDescriptor;

/** Configuration options for the usePermission hook */
type usePermissionOptions =
  | PermissionName
  | PermissionDescriptor
  | PermissionType[];

/** Return values from the usePermission hook */
interface usePermissionResult {
  /** Array of current permission statuses for all requested permissions */
  permissionStatus: PermissionStatus[];
  /** Function to request permissions from the user (may show prompts) */
  requestPermissions: () => Promise<void>;
  /** Function to check current permission status without requesting */
  checkPermissions: () => Promise<void>;
  /** Whether permission checks are currently in progress */
  isLoading: boolean;
  /** Error message if permission operations failed, null if successful */
  error: string | null;
}

/**
 * React hook for managing browser permissions (camera, microphone, notifications, etc.)
 *
 * This hook provides a unified interface for checking and requesting various browser permissions.
 * It automatically monitors permission changes and provides loading states and error handling.
 *
 * @param permissions - Single permission name, permission descriptor, or array of either
 * @returns Object containing permission statuses, request functions, and state information
 *
 * @example
 * ```tsx
 * // Single permission
 * const { permissionStatus, requestPermissions } = usePermission('camera');
 *
 * // Multiple permissions
 * const { permissionStatus, requestPermissions } = usePermission(['camera', 'microphone']);
 *
 * // With descriptor options
 * const { permissionStatus, requestPermissions } = usePermission({
 *   name: 'midi',
 *   sysex: true
 * });
 *
 * // Check permission status
 * if (permissionStatus[0]?.state === 'granted') {
 *   // Permission is granted
 * }
 *
 * // Request permission from user
 * await requestPermissions();
 * ```
 */

export const usePermission = (
  permissions: usePermissionOptions
): usePermissionResult => {
  // Normalize input to an array of PermissionDescriptor objects
  const normalizedPermissions: PermissionDescriptor[] = (() => {
    if (typeof permissions === "string") {
      return [{ name: permissions }];
    }
    if (Array.isArray(permissions)) {
      return permissions.map((item) =>
        typeof item === "string" ? { name: item } : item
      );
    }
    return [permissions];
  })();

  // Use ref to store permissions to avoid unnecessary re-renders
  const permissionRef = useRef(normalizedPermissions);

  // State for permission statuses and loading/error states
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update ref when permissions change
  useEffect(() => {
    permissionRef.current = normalizedPermissions;
  }, [normalizedPermissions]);

  /**
   * Checks the current status of all permissions without requesting them.
   * This function only queries existing permissions and never shows prompts to the user.
   */
  const checkPermissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const localPermissionStatus = [];
      for (const permission of permissionRef.current) {
        try {
          const status = await navigator.permissions.query(permission);
          localPermissionStatus.push(status);
        } catch (error) {
          console.warn(`Permission ${permission.name} not supported:`, error);
          // Create a mock status for unsupported permissions
          localPermissionStatus.push({
            state: "denied",
            name: permission.name,
          } as PermissionStatus);
        }
      }
      setPermissionStatus(localPermissionStatus);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to check permissions"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Requests permissions from the user for all configured permissions.
   * This function may show browser prompts and will trigger the appropriate API calls
   * for each permission type (e.g., getUserMedia for camera, requestMIDIAccess for MIDI).
   */
  const requestPermissions = useCallback(async () => {
    for (const permission of permissionRef.current) {
      const permissionName = permission.name;
      try {
        switch (permissionName) {
          case "notifications":
            // Request notification permission
            await Notification.requestPermission();
            break;
          case "geolocation":
            // Request geolocation by attempting to get current position
            await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            break;
          case "camera":
          case "microphone":
            // Request media device access
            await navigator.mediaDevices.getUserMedia({
              video: permissionName === "camera",
              audio: permissionName === "microphone",
            });
            break;
          case "midi":
            // Request MIDI access with optional SysEx support
            const midiOptions = (permission as any).sysex
              ? { sysex: true }
              : undefined;
            await navigator.requestMIDIAccess(midiOptions);
            break;
          case "persistent-storage":
            // Request persistent storage
            await navigator.storage.persist();
            break;
          case "push":
            // Request push notification permission (requires service worker)
            if ("serviceWorker" in navigator) {
              const registration = await navigator.serviceWorker.ready;
              await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: null, // You'd need to provide actual key
              });
            }
            break;

          default:
            console.warn(`No request method implemented for ${permissionName}`);
        }
        // Re-check permissions after successful request
        await checkPermissions();
      } catch (error) {
        console.error(`Failed to request ${permissionName} permission:`, error);
        // Re-check permissions even on error to get updated status
        await checkPermissions();
      }
    }
  }, [checkPermissions]);

  // Check permissions on hook initialization
  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  // Listen for permission status changes and automatically update
  useEffect(() => {
    const listeners: (() => void)[] = [];
    const handleChange = () => {
      // Re-check all permissions when any permission status changes
      checkPermissions();
    };

    // Add event listeners to each permission status object
    permissionStatus.forEach((status, index) => {
      if (status && typeof status.addEventListener === "function") {
        status.addEventListener("change", handleChange);
        listeners.push(() =>
          status.removeEventListener("change", handleChange)
        );
      }
    });

    // Cleanup listeners on unmount or permission status change
    return () => {
      listeners.forEach((cleanup) => cleanup());
    };
  }, [permissionStatus, checkPermissions]);

  return {
    permissionStatus,
    requestPermissions,
    checkPermissions,
    isLoading,
    error,
  };
};
