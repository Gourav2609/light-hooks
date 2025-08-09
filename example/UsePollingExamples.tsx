import React, { useState, useCallback } from "react";
import { usePolling } from "light-hooks";

// Mock API functions for demonstration
const mockAPIFetch = async (
  url: string,
  delay: number = 1000
): Promise<any> => {
  await new Promise((resolve) => setTimeout(resolve, delay));
  const shouldFail = Math.random() < 0.2; // 20% chance of failure

  if (shouldFail) {
    throw new Error(`API Error: Failed to fetch from ${url}`);
  }

  return {
    timestamp: new Date().toISOString(),
    data: `Response from ${url}`,
    random: Math.floor(Math.random() * 1000),
    url,
  };
};

const fetchUserCount = async (): Promise<{
  count: number;
  lastUpdated: string;
}> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return {
    count: Math.floor(Math.random() * 100) + 50,
    lastUpdated: new Date().toLocaleTimeString(),
  };
};

const fetchServerStatus = async (): Promise<{
  status: string;
  uptime: number;
  load: number;
}> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    status: Math.random() > 0.1 ? "healthy" : "degraded",
    uptime: Math.floor(Math.random() * 86400),
    load: Math.round(Math.random() * 100 * 100) / 100,
  };
};

// Basic Interval Polling Example
export const BasicPollingExample: React.FC = () => {
  const { data, isLoading, error, isRunning, start, stop } = usePolling({
    fn: () => fetchUserCount(),
    interval: 3000,
    autoStart: true,
  });

  return (
    <div
      style={{
        marginBottom: "30px",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "5px",
      }}
    >
      <h3>📊 Basic Interval Polling</h3>
      <p style={{ margin: "0 0 15px 0", color: "#666" }}>
        Automatically polls user count every 3 seconds
      </p>

      <div
        style={{
          padding: "12px",

          borderRadius: "4px",
          marginBottom: "15px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              color: isRunning ? "#28a745" : "#6c757d",
            }}
          >
            {isRunning ? "🟢" : "⚫"}
          </span>
          <strong>Status:</strong>
          <span style={{ color: isRunning ? "#28a745" : "#6c757d" }}>
            {isRunning ? "Polling Active" : "Stopped"}
          </span>
          {isLoading && <span style={{ color: "#007bff" }}>🔄 Loading...</span>}
        </div>

        {data && (
          <div style={{ fontSize: "14px", fontFamily: "monospace" }}>
            <div>
              <strong>User Count:</strong> {data.count}
            </div>
            <div>
              <strong>Last Updated:</strong> {data.lastUpdated}
            </div>
          </div>
        )}

        {error && (
          <div style={{ color: "#dc3545", fontSize: "14px", marginTop: "8px" }}>
            ❌ Error: {error.message}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={start}
          disabled={isRunning}
          style={{
            padding: "8px 16px",
            backgroundColor: isRunning ? "#6c757d" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isRunning ? "not-allowed" : "pointer",
          }}
        >
          ▶️ Start Polling
        </button>
        <button
          onClick={stop}
          disabled={!isRunning}
          style={{
            padding: "8px 16px",
            backgroundColor: !isRunning ? "#6c757d" : "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: !isRunning ? "not-allowed" : "pointer",
          }}
        >
          ⏹️ Stop Polling
        </button>
      </div>
    </div>
  );
};

// Error Handling and Retry Example
export const ErrorHandlingExample: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = useCallback((message: string) => {
    setLogs((prev) => [
      `${new Date().toLocaleTimeString()}: ${message}`,
      ...prev.slice(0, 4),
    ]);
  }, []);

  const { data, isLoading, error, retryCount, start, stop, reset } = usePolling(
    {
      fn: () => mockAPIFetch("/api/unreliable", 600),
      interval: 2000,
      maxRetries: 3,
      retryDelay: 1500,
      autoStart: false,
      onSuccess: (data) => addLog(`✅ Success: ${data.data}`),
      onError: (error, attempts) =>
        addLog(`❌ Error (attempt ${attempts}): ${error.message}`),
    }
  );

  return (
    <div
      style={{
        marginBottom: "30px",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "5px",
      }}
    >
      <h3>🔄 Error Handling & Retry Logic</h3>
      <p style={{ margin: "0 0 15px 0", color: "#666" }}>
        Demonstrates retry logic with a 20% failure rate API
      </p>

      <div
        style={{
          padding: "12px",

          borderRadius: "4px",
          marginBottom: "15px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            marginBottom: "10px",
          }}
        >
          <div>
            <strong>Retry Count:</strong>
            <span
              style={{
                marginLeft: "5px",
                color: retryCount > 0 ? "#dc3545" : "#28a745",
              }}
            >
              {retryCount}
            </span>
          </div>
          {isLoading && <span style={{ color: "#007bff" }}>🔄 Loading...</span>}
        </div>

        {data && (
          <div
            style={{
              padding: "8px",
              backgroundColor: "#555555",
              borderRadius: "3px",
              marginBottom: "10px",
              fontSize: "14px",
            }}
          >
            <strong>Latest Success:</strong> {data.data} (Random: {data.random})
          </div>
        )}

        {error && (
          <div
            style={{
              padding: "8px",
              backgroundColor: "#121212",
              borderRadius: "3px",
              marginBottom: "10px",
              fontSize: "14px",
            }}
          >
            <strong>Current Error:</strong> {error.message}
          </div>
        )}

        <div
          style={{
            maxHeight: "120px",
            overflowY: "auto",
            fontSize: "12px",
            fontFamily: "monospace",
            backgroundColor: "grey",
            padding: "8px",
            borderRadius: "3px",
            border: "1px solid #dee2e6",
          }}
        >
          <div>
            <strong>Activity Log:</strong>
          </div>
          {logs.length === 0 ? (
            <div style={{ color: "#6c757d", fontStyle: "italic" }}>
              No activity yet
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index} style={{ margin: "2px 0"}}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
          onClick={start}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🚀 Start Unreliable Polling
        </button>
        <button
          onClick={stop}
          style={{
            padding: "8px 16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ⏹️ Stop
        </button>
        <button
          onClick={reset}
          style={{
            padding: "8px 16px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🔄 Reset Errors
        </button>
      </div>
    </div>
  );
};

// Long Polling Example
export const LongPollingExample: React.FC = () => {
  const [connectionLog, setConnectionLog] = useState<string[]>([]);

  const addConnectionLog = useCallback((message: string) => {
    setConnectionLog((prev) => [
      `${new Date().toLocaleTimeString()}: ${message}`,
      ...prev.slice(0, 3),
    ]);
  }, []);

  const { data, isLoading, isRunning, start, stop } = usePolling({
    fn: () => fetchServerStatus(),
    type: "long",
    interval: 100, // Small delay between long poll requests
    autoStart: false,
    onSuccess: () => addConnectionLog("📡 Long poll successful"),
    onError: (error) =>
      addConnectionLog(`❌ Long poll failed: ${error.message}`),
  });

  return (
    <div
      style={{
        marginBottom: "30px",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "5px",
      }}
    >
      <h3>📡 Long Polling Example</h3>
      <p style={{ margin: "0 0 15px 0", color: "#666" }}>
        Continuous long polling for real-time server status monitoring
      </p>

      <div
        style={{
          padding: "12px",

          borderRadius: "4px",
          marginBottom: "15px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              color: isRunning ? "#28a745" : "#6c757d",
            }}
          >
            {isRunning ? "🟢" : "⚫"}
          </span>
          <strong>Connection:</strong>
          <span style={{ color: isRunning ? "#28a745" : "#6c757d" }}>
            {isRunning ? "Active Long Polling" : "Disconnected"}
          </span>
          {isLoading && <span style={{ color: "#007bff" }}>🔄</span>}
        </div>

        {data && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                padding: "8px",
                color:"#000",
                backgroundColor:
                  data.status === "healthy" ? "#d4edda" : "#fff3cd",
                borderRadius: "3px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "12px", color: "#666" }}>Status</div>
              <div style={{ fontWeight: "bold", textTransform: "uppercase" }}>
                {data.status === "healthy" ? "✅ HEALTHY" : "⚠️ DEGRADED"}
              </div>
            </div>
            <div
              style={{
                padding: "8px",
                color:"#000",
                backgroundColor: "#e2e3e5",
                borderRadius: "3px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "12px", color: "#666" }}>Uptime</div>
              <div style={{ fontWeight: "bold" }}>
                {Math.floor(data.uptime / 3600)}h{" "}
                {Math.floor((data.uptime % 3600) / 60)}m
              </div>
            </div>
            <div
              style={{
                padding: "8px",
                color:"#000",
                backgroundColor: data.load > 80 ? "#f8d7da" : "#d1ecf1",
                borderRadius: "3px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "12px", color: "#666" }}>Load</div>
              <div style={{ fontWeight: "bold" }}>{data.load}%</div>
            </div>
          </div>
        )}

        <div
          style={{
            fontSize: "12px",
            fontFamily: "monospace",
            backgroundColor: "grey",
            padding: "8px",
            borderRadius: "3px",
            border: "1px solid #dee2e6",
            maxHeight: "80px",
            overflowY: "auto",
          }}
        >
          <div>
            <strong>Connection Log:</strong>
          </div>
          {connectionLog.length === 0 ? (
            <div style={{ color: "#6c757d", fontStyle: "italic" }}>
              No activity yet
            </div>
          ) : (
            connectionLog.map((log, index) => (
              <div key={index} style={{ margin: "2px 0" }}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={start}
          disabled={isRunning}
          style={{
            padding: "8px 16px",
            backgroundColor: isRunning ? "#6c757d" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isRunning ? "not-allowed" : "pointer",
          }}
        >
          📡 Connect
        </button>
        <button
          onClick={stop}
          disabled={!isRunning}
          style={{
            padding: "8px 16px",
            backgroundColor: !isRunning ? "#6c757d" : "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: !isRunning ? "not-allowed" : "pointer",
          }}
        >
          🔌 Disconnect
        </button>
      </div>
    </div>
  );
};

// Manual Polling Example
export const ManualPollingExample: React.FC = () => {
  const [manualData, setManualData] = useState<any[]>([]);

  const { data, isLoading, error, poll, reset } = usePolling({
    fn: () => mockAPIFetch("/api/manual", 800),
    autoStart: false,
    onSuccess: (newData) => {
      setManualData((prev) => [newData, ...prev.slice(0, 2)]);
    },
  });

  const handleManualPoll = async () => {
    try {
      await poll();
    } catch (err) {
      console.error("Manual poll failed:", err);
    }
  };

  return (
    <div
      style={{
        marginBottom: "30px",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "5px",
      }}
    >
      <h3>👆 Manual Polling Control</h3>
      <p style={{ margin: "0 0 15px 0", color: "#666" }}>
        Trigger polls manually with full control over when to fetch data
      </p>

      <div
        style={{
          padding: "12px",

          borderRadius: "4px",
          marginBottom: "15px",
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <button
            onClick={handleManualPoll}
            disabled={isLoading}
            style={{
              padding: "10px 20px",
              backgroundColor: isLoading ? "#6c757d" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {isLoading ? "🔄 Fetching..." : "🎯 Manual Poll"}
          </button>
          {error && (
            <button
              onClick={reset}
              style={{
                marginLeft: "10px",
                padding: "10px 15px",
                backgroundColor: "#ffc107",
                color: "black",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              🔄 Reset
            </button>
          )}
        </div>

        {error && (
          <div
            style={{
              padding: "8px",
              backgroundColor: "#f8d7da",
              borderRadius: "3px",
              marginBottom: "10px",
              fontSize: "14px",
            }}
          >
            <strong>Error:</strong> {error.message}
          </div>
        )}

        <div>
          <strong>Poll History:</strong>
          {manualData.length === 0 ? (
            <div
              style={{
                color: "#6c757d",
                fontStyle: "italic",
                marginTop: "5px",
              }}
            >
              No polls executed yet. Click "Manual Poll" to fetch data.
            </div>
          ) : (
            <div style={{ marginTop: "10px" }}>
              {manualData.map((item, index) => (
                <div
                  key={`${item.timestamp}-${index}`}
                  style={{
                    padding: "8px",
                    backgroundColor: index === 0 ? "#d4edda" : "#e9ecef",
                    borderRadius: "3px",
                    marginBottom: "5px",
                    fontSize: "14px",
                    border:
                      index === 0 ? "2px solid #28a745" : "1px solid #dee2e6",
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>
                    {index === 0 ? "🆕 Latest: " : `📋 ${index + 1}: `}
                    {item.data}
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Time: {new Date(item.timestamp).toLocaleTimeString()} |
                    Random: {item.random}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Multi-Instance Polling Example
export const MultiInstanceExample: React.FC = () => {
  // Fast polling for critical data
  const criticalData = usePolling({
    fn: () => fetchUserCount(),
    interval: 1000,
    autoStart: true,
  });

  // Medium polling for server status
  const serverData = usePolling({
    fn: () => fetchServerStatus(),
    interval: 5000,
    autoStart: true,
  });

  // Manual polling for reports
  const reportData = usePolling({
    fn: () => mockAPIFetch("/api/reports", 1200),
    autoStart: false,
  });

  const pollingInstances = [
    {
      name: "Critical Metrics",
      data: criticalData,
      interval: "1s",
      color: "#dc3545",
      description: "High-frequency user count monitoring",
    },
    {
      name: "Server Health",
      data: serverData,
      interval: "5s",
      color: "#28a745",
      description: "Regular server status checks",
    },
    {
      name: "Report Generator",
      data: reportData,
      interval: "Manual",
      color: "#007bff",
      description: "On-demand report generation",
    },
  ];

  return (
    <div
      style={{
        marginBottom: "30px",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "5px",
      }}
    >
      <h3>🎛️ Multiple Polling Instances</h3>
      <p style={{ margin: "0 0 15px 0", color: "#666" }}>
        Managing different polling strategies simultaneously
      </p>

      <div style={{ display: "grid", gap: "15px" }}>
        {pollingInstances.map((instance, index) => (
          <div
            key={instance.name}
            style={{
              padding: "12px",

              borderRadius: "4px",
              borderLeft: `4px solid ${instance.color}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <div>
                <strong style={{ color: instance.color }}>
                  {instance.name}
                </strong>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {instance.description} • Interval: {instance.interval}
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    color: instance.data.isRunning ? "#28a745" : "#6c757d",
                  }}
                >
                  {instance.data.isRunning ? "🟢" : "⚫"}
                </span>
                {instance.data.isLoading && <span>🔄</span>}
              </div>
            </div>

            <div style={{ fontSize: "14px" }}>
              {instance.data.error ? (
                <div style={{ color: "#dc3545" }}>
                  ❌ {instance.data.error.message}
                </div>
              ) : instance.data.data ? (
                <div style={{ color: "#28a745" }}>
                  ✅ Last update:{" "}
                  {JSON.stringify(instance.data.data).slice(0, 100)}...
                </div>
              ) : (
                <div style={{ color: "#6c757d" }}>⏳ No data yet</div>
              )}
            </div>

            {index === 2 && ( // Report Generator controls
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => reportData.poll()}
                  disabled={reportData.isLoading}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: reportData.isLoading
                      ? "#6c757d"
                      : "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    cursor: reportData.isLoading ? "not-allowed" : "pointer",
                    fontSize: "12px",
                  }}
                >
                  {reportData.isLoading ? "Generating..." : "Generate Report"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Examples Component
export const UsePollingExamples: React.FC = () => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <div style={{ marginBottom: "40px" }}>
        <h1>usePolling Hook Examples</h1>
        <p style={{ color: "#666", fontSize: "16px" }}>
          Comprehensive examples demonstrating polling, error handling, and
          real-time data fetching.
        </p>
      </div>

      <BasicPollingExample />
      <ErrorHandlingExample />
      <LongPollingExample />
      <ManualPollingExample />
      <MultiInstanceExample />
    </div>
  );
};
