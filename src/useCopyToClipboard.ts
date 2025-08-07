import { useCallback, useState } from 'react';

/**
 * Configuration options for the useCopyToClipboard hook
 */
export interface UseCopyToClipboardOptions {
  /**
   * Duration in milliseconds to show success state
   * @default 2000
   */
  successDuration?: number;
  /**
   * Whether to reset the state after the success duration
   * @default true
   */
  resetAfterDelay?: boolean;
  /**
   * Custom success message
   * @default 'Copied to clipboard!'
   */
  successMessage?: string;
}

/**
 * Return values from the useCopyToClipboard hook
 */
export interface UseCopyToClipboardReturn {
  /** The last copied value */
  copiedValue: string | null;
  /** Whether the copy operation was successful */
  copied: boolean;
  /** Error message if copy failed */
  error: string | null;
  /** Whether a copy operation is in progress */
  loading: boolean;
  /** Function to copy text to clipboard */
  copy: (text: string) => Promise<boolean>;
  /** Function to reset the state */
  reset: () => void;
}

/**
 * A React hook for copying text to the clipboard with feedback and error handling
 * 
 * This hook provides a simple interface for copying text to the clipboard using
 * the modern Clipboard API with fallback to legacy methods. It includes loading
 * states, success feedback, and error handling.
 * 
 * @param options - Configuration options for copy behavior
 * @returns Object containing copy function and state information
 * 
 * @example
 * ```tsx
 * import { useCopyToClipboard } from 'light-hooks';
 * 
 * function ShareComponent() {
 *   const { copy, copied, error, loading } = useCopyToClipboard();
 * 
 *   const shareUrl = 'https://example.com/article/123';
 * 
 *   const handleCopy = () => {
 *     copy(shareUrl);
 *   };
 * 
 *   return (
 *     <div>
 *       <input value={shareUrl} readOnly />
 *       <button onClick={handleCopy} disabled={loading}>
 *         {loading ? 'Copying...' : copied ? 'Copied!' : 'Copy'}
 *       </button>
 *       {error && <p style={{ color: 'red' }}>Failed to copy: {error}</p>}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // Code snippet copy functionality
 * function CodeBlock({ code }: { code: string }) {
 *   const { copy, copied } = useCopyToClipboard({
 *     successDuration: 1000,
 *     successMessage: 'Code copied!'
 *   });
 * 
 *   return (
 *     <div className="code-block">
 *       <pre>{code}</pre>
 *       <button onClick={() => copy(code)}>
 *         {copied ? '✓ Copied' : '📋 Copy'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // Copy user-generated content
 * function UserProfile({ user }) {
 *   const { copy, copied, error } = useCopyToClipboard();
 * 
 *   const copyProfile = () => {
 *     copy(`Check out ${user.name}'s profile: ${user.profileUrl}`);
 *   };
 * 
 *   return (
 *     <div>
 *       <h1>{user.name}</h1>
 *       <button onClick={copyProfile}>
 *         {copied ? 'Profile link copied!' : 'Share profile'}
 *       </button>
 *       {error && <span>Copy failed</span>}
 *     </div>
 *   );
 * }
 * ```
 */
export const useCopyToClipboard = (
  options: UseCopyToClipboardOptions = {}
): UseCopyToClipboardReturn => {
  const {
    successDuration = 2000,
    resetAfterDelay = true,
    successMessage = 'Copied to clipboard!',
  } = options;

  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Reset state
  const reset = useCallback(() => {
    setCopiedValue(null);
    setCopied(false);
    setError(null);
    setLoading(false);
  }, []);

  // Legacy fallback for older browsers
  const fallbackCopy = useCallback((text: string): boolean => {
    try {
      // Create a temporary textarea element
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Make it invisible
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      // Execute copy command
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      return successful;
    } catch (err) {
      console.error('Fallback copy failed:', err);
      return false;
    }
  }, []);

  // Main copy function
  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!text) {
        setError('No text provided to copy');
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        // Try modern Clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback to legacy method
          const success = fallbackCopy(text);
          if (!success) {
            throw new Error('Copy operation failed');
          }
        }

        // Success
        setCopiedValue(text);
        setCopied(true);
        setError(null);

        // Reset after delay if configured
        if (resetAfterDelay) {
          setTimeout(() => {
            setCopied(false);
            setError(null);
          }, successDuration);
        }

        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Copy failed';
        setError(errorMessage);
        setCopied(false);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fallbackCopy, successDuration, resetAfterDelay]
  );

  return {
    copiedValue,
    copied,
    error,
    loading,
    copy,
    reset,
  };
};

export default useCopyToClipboard;
