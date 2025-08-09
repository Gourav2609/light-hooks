import React, { useState } from "react";
import { useWebSocket } from "light-hooks";

const UseWebSocketExamples: React.FC = () => {
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState("");

  // Basic WebSocket connection with all features
  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    readyState,
    connect,
    disconnect,
    reconnect,
    isReconnecting,
    reconnectCount,
  } = useWebSocket({
    url: "wss://echo.websocket.org/",
    onOpen: () => {
      console.log("WebSocket connected!");
      setMessageHistory((prev) => [...prev, "🟢 Connected to WebSocket"]);
    },
    onClose: () => {
      console.log("WebSocket disconnected!");
      setMessageHistory((prev) => [...prev, "🔴 Disconnected from WebSocket"]);
    },
    onError: (error) => {
      console.error("WebSocket error:", error);
      setMessageHistory((prev) => [...prev, "❌ WebSocket error occurred"]);
    },
    onMessage: (message) => {
      setMessageHistory((prev) => [...prev, `📨 Received: ${message.data}`]);
    },
    shouldReconnect: true,
    reconnectAttempts: 5,
    reconnectInterval: 2000,
  });

  const getReadyStateText = (state: number) => {
    switch (state) {
      case 0:
        return "CONNECTING";
      case 1:
        return "OPEN";
      case 2:
        return "CLOSING";
      case 3:
        return "CLOSED";
      default:
        return "UNKNOWN";
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageHistory((prev) => [...prev, `📤 Sent: ${messageInput}`]);
      setMessageInput("");
    }
  };

  const handleSendJsonMessage = () => {
    const jsonMessage = {
      type: "test",
      timestamp: new Date().toISOString(),
      data: messageInput || "Hello JSON!",
    };
    sendJsonMessage(jsonMessage);
    setMessageHistory((prev) => [
      ...prev,
      `📤 Sent JSON: ${JSON.stringify(jsonMessage)}`,
    ]);
    setMessageInput("");
  };

  const clearHistory = () => {
    setMessageHistory([]);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>useWebSocket Hook Examples</h2>

      {/* Connection Status */}
      <div
        style={{
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderRadius: "5px",
        }}
      >
        <h3>Connection Status</h3>
        <p>
          <strong>Ready State:</strong> {getReadyStateText(readyState)} (
          {readyState})
        </p>
        <p>
          <strong>Is Reconnecting:</strong> {isReconnecting ? "Yes" : "No"}
        </p>
        <p>
          <strong>Reconnect Count:</strong> {reconnectCount}
        </p>
      </div>

      {/* Controls */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Controls</h3>
        <button onClick={connect} disabled={readyState === 1}>
          Connect
        </button>
        <button
          onClick={disconnect}
          disabled={readyState === 3}
          style={{ marginLeft: "10px" }}
        >
          Disconnect
        </button>
        <button onClick={reconnect} style={{ marginLeft: "10px" }}>
          Reconnect
        </button>
        <button onClick={clearHistory} style={{ marginLeft: "10px" }}>
          Clear History
        </button>
      </div>

      {/* Message Input */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Send Message</h3>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Enter message..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            style={{ flex: 1, padding: "8px" }}
          />
          <button onClick={handleSendMessage} disabled={readyState !== 1}>
            Send Text
          </button>
          <button onClick={handleSendJsonMessage} disabled={readyState !== 1}>
            Send JSON
          </button>
        </div>
      </div>

      {/* Message History */}
      <div>
        <h3>Message History</h3>
        <div
          style={{
            height: "300px",
            overflowY: "auto",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        >
          {messageHistory.length === 0 ? (
            <p style={{ color: "#666" }}>No messages yet...</p>
          ) : (
            messageHistory.map((message, index) => (
              <div
                key={index}
                style={{ marginBottom: "5px", fontSize: "14px" }}
              >
                <span style={{ color: "#666" }}>
                  [{new Date().toLocaleTimeString()}]
                </span>{" "}
                {message}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Feature Examples */}
      <div style={{ marginTop: "20px" }}>
        <h3>Features Demonstrated</h3>
        <ul>
          <li>
            ✅ Automatic reconnection with configurable attempts and intervals
          </li>
          <li>✅ Connection state management and monitoring</li>
          <li>✅ Send text and JSON messages</li>
          <li>✅ Manual connect/disconnect/reconnect controls</li>
          <li>✅ Proper cleanup and memory leak prevention</li>
          <li>✅ TypeScript support with proper typing</li>
          <li>✅ Event callbacks for all WebSocket events</li>
          <li>✅ Message history tracking</li>
        </ul>
      </div>
    </div>
  );
};

export default UseWebSocketExamples;
