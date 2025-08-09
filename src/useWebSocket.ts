import { useCallback, useEffect, useRef, useState } from "react";

export type WebSocketReadyState = 0 | 1 | 2 | 3; // CONNECTING | OPEN | CLOSING | CLOSED

export interface UseWebSocketOptions {
  /** WebSocket server URL */
  url: string;
  /** Callback when connection opens */
  onOpen?: (event: Event) => void;
  /** Callback when an error occurs */
  onError?: (event: Event) => void;
  /** Callback when a message is received */
  onMessage?: (event: MessageEvent) => void;
  /** Callback when connection closes */
  onClose?: (event: CloseEvent) => void;
  /** Whether to automatically reconnect on connection loss (default: false) */
  shouldReconnect?: boolean;
  /** Maximum number of reconnection attempts (default: 5) */
  reconnectAttempts?: number;
  /** Delay between reconnection attempts in ms (default: 1000) */
  reconnectInterval?: number;
  /** WebSocket protocols */
  protocols?: string | string[];
  /** Whether to connect immediately (default: true) */
  autoConnect?: boolean;
}

export interface UseWebSocketResults {
  /** Send a message through the WebSocket */
  sendMessage: (message: string | ArrayBuffer | Blob) => void;
  /** Send a JSON message through the WebSocket */
  sendJsonMessage: (message: any) => void;
  /** Last received message */
  lastMessage: MessageEvent | null;
  /** Current connection ready state */
  readyState: WebSocketReadyState;
  /** Manually connect to WebSocket */
  connect: () => void;
  /** Manually disconnect from WebSocket */
  disconnect: () => void;
  /** Reconnect to WebSocket */
  reconnect: () => void;
  /** Whether currently attempting to reconnect */
  isReconnecting: boolean;
  /** Current reconnection attempt count */
  reconnectCount: number;
}

export const useWebSocket = ({
  url,
  onOpen,
  onClose,
  onError,
  onMessage,
  shouldReconnect = false,
  reconnectAttempts = 5,
  reconnectInterval = 1000,
  protocols,
  autoConnect = true,
}: UseWebSocketOptions): UseWebSocketResults => {
  // State management
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const [readyState, setReadyState] = useState<WebSocketReadyState>(3); // CLOSED
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [reconnectCount, setReconnectCount] = useState(0);

  // Refs for stable references and cleanup
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldConnectRef = useRef(autoConnect);
  const mountedRef = useRef(true);

  // Stable callback refs
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);
  const onErrorRef = useRef(onError);
  const onMessageRef = useRef(onMessage);

  // Update callback refs when props change
  useEffect(() => {
    onOpenRef.current = onOpen;
    onCloseRef.current = onClose;
    onErrorRef.current = onError;
    onMessageRef.current = onMessage;
  }, [onOpen, onClose, onError, onMessage]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Connect function
  const connect = useCallback(() => {
    if (!mountedRef.current) return;
    
    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    try {
      const ws = new WebSocket(url, protocols);
      wsRef.current = ws;
      shouldConnectRef.current = true;
      ws.onopen = (event) => {
        if (!mountedRef.current) return;
        setReadyState(1); // OPEN
        setIsReconnecting(false);
        setReconnectCount(0);
        onOpenRef.current?.(event);
      };

      ws.onclose = (event) => {
        if (!mountedRef.current) return;
        setReadyState(3); // CLOSED
        onCloseRef.current?.(event);

        // Attempt reconnection if enabled and connection was not manually closed
        if (shouldReconnect && shouldConnectRef.current && reconnectCount < reconnectAttempts) {
          setIsReconnecting(true);
          setReconnectCount(prev => prev + 1);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (mountedRef.current && shouldConnectRef.current) {
              connect();
            }
          }, reconnectInterval);
        } else {
          setIsReconnecting(false);
        }
      };

      ws.onerror = (event) => {
        if (!mountedRef.current) return;
        onErrorRef.current?.(event);
      };

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;
        setLastMessage(event);
        onMessageRef.current?.(event);
      };

      // Update ready state during connection
      setReadyState(0); // CONNECTING

    } catch (error) {
      console.error('WebSocket connection failed:', error);
      if (onErrorRef.current) {
        onErrorRef.current(new Event('error'));
      }
    }
  }, [url, protocols, shouldReconnect, reconnectAttempts, reconnectInterval, reconnectCount]);

  // Disconnect function
  const disconnect = useCallback(() => {
    shouldConnectRef.current = false;
    setIsReconnecting(false);
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
    }
  }, []);

  // Reconnect function (manual)
  const reconnect = useCallback(() => {
    setReconnectCount(0);
    connect();
  }, [connect]);

  // Send message function
  const sendMessage = useCallback((message: string | ArrayBuffer | Blob) => {
    if (wsRef.current?.readyState === 1) { // OPEN
      wsRef.current.send(message);
    } else {
      console.warn('WebSocket is not connected. Unable to send message.');
    }
  }, []);

  // Send JSON message function
  const sendJsonMessage = useCallback((message: any) => {
    try {
      const jsonString = JSON.stringify(message);
      sendMessage(jsonString);
    } catch (error) {
      console.error('Failed to stringify message:', error);
    }
  }, [sendMessage]);

  // Auto-connect effect
  useEffect(() => {
    if (autoConnect) {
      connect();
    }
  }, [autoConnect, connect]);

  // URL change effect
  useEffect(() => {
    if (shouldConnectRef.current) {
      connect();
    }
  }, [url]);

  return {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    readyState,
    connect,
    disconnect,
    reconnect,
    isReconnecting,
    reconnectCount,
  };
};
