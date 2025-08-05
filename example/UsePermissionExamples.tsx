import React, { useState } from "react";
import { usePermission } from "light-hooks";

const UsePermissionExamples: React.FC = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>usePermission Hook Examples</h1>

      <BasicPermissionExample />
      <MultiplePermissionsExample />
      <MIDIPermissionExample />
      <CameraAndMicrophoneExample />
      <NotificationPermissionExample />
      <PermissionStatusMonitorExample />
    </div>
  );
};

// Basic single permission example
const BasicPermissionExample: React.FC = () => {
  const { permissionStatus, requestPermissions, isLoading, error } =
    usePermission("geolocation");

  return (
    <div
      style={{
        marginBottom: "40px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h2>📍 Basic Geolocation Permission</h2>
      <p>Simple example requesting geolocation permission.</p>

      <div style={{ marginBottom: "15px" }}>
        <strong>Status:</strong>
        <span
          style={{
            color:
              permissionStatus[0]?.state === "granted"
                ? "green"
                : permissionStatus[0]?.state === "denied"
                ? "red"
                : "orange",
            marginLeft: "10px",
            fontWeight: "bold",
          }}
        >
          {permissionStatus[0]?.state || "checking..."}
        </span>
        {isLoading && (
          <span style={{ marginLeft: "10px", color: "blue" }}>Loading...</span>
        )}
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "15px" }}>Error: {error}</div>
      )}

      <button
        onClick={requestPermissions}
        disabled={isLoading || permissionStatus[0]?.state === "granted"}
        style={{
          padding: "10px 20px",
          backgroundColor:
            permissionStatus[0]?.state === "granted" ? "#4CAF50" : "#2196F3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        {permissionStatus[0]?.state === "granted"
          ? "✓ Permission Granted"
          : "Request Geolocation"}
      </button>

      <div style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
        <strong>What this does:</strong> Checks and requests access to device
        location.
      </div>
    </div>
  );
};

// Multiple permissions example
const MultiplePermissionsExample: React.FC = () => {
  const {
    permissionStatus,
    requestPermissions,
    checkPermissions,
    isLoading,
    error,
  } = usePermission(["notifications", "geolocation", "persistent-storage"]);

  const getStatusColor = (state: string) => {
    switch (state) {
      case "granted":
        return "green";
      case "denied":
        return "red";
      case "prompt":
        return "orange";
      default:
        return "gray";
    }
  };

  return (
    <div
      style={{
        marginBottom: "40px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h2>📋 Multiple Permissions</h2>
      <p>Example requesting multiple permissions at once.</p>

      <div style={{ marginBottom: "15px" }}>
        <h4>Permission Status:</h4>
        {["notifications", "geolocation", "persistent-storage"].map(
          (name, index) => (
            <div key={name} style={{ marginBottom: "8px" }}>
              <strong>{name}:</strong>
              <span
                style={{
                  color: getStatusColor(permissionStatus[index]?.state || ""),
                  marginLeft: "10px",
                  fontWeight: "bold",
                  textTransform: "capitalize",
                }}
              >
                {permissionStatus[index]?.state || "checking..."}
              </span>
            </div>
          )
        )}
        {isLoading && (
          <div style={{ color: "blue", fontStyle: "italic" }}>
            Checking permissions...
          </div>
        )}
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "15px" }}>Error: {error}</div>
      )}

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
          onClick={requestPermissions}
          disabled={isLoading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          Request All Permissions
        </button>

        <button
          onClick={checkPermissions}
          disabled={isLoading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#FF9800",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          Refresh Status
        </button>
      </div>

      <div style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
        <strong>What this does:</strong> Manages multiple permissions and shows
        their current states.
      </div>
    </div>
  );
};

// MIDI permission with SysEx example
const MIDIPermissionExample: React.FC = () => {
  const [useSysEx, setUseSysEx] = useState(false);

  const { permissionStatus, requestPermissions, isLoading, error } =
    usePermission({
      name: "midi",
      sysex: useSysEx,
    } as any);

  return (
    <div
      style={{
        marginBottom: "40px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h2>🎹 MIDI Permission with SysEx</h2>
      <p>Example showing MIDI access with optional System Exclusive support.</p>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            checked={useSysEx}
            onChange={(e) => setUseSysEx(e.target.checked)}
          />
          Enable SysEx (System Exclusive) access
        </label>
        <small style={{ color: "#666", marginLeft: "26px" }}>
          SysEx allows device-specific configuration and firmware access
        </small>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <strong>MIDI Status:</strong>
        <span
          style={{
            color:
              permissionStatus[0]?.state === "granted"
                ? "green"
                : permissionStatus[0]?.state === "denied"
                ? "red"
                : "orange",
            marginLeft: "10px",
            fontWeight: "bold",
          }}
        >
          {permissionStatus[0]?.state || "checking..."}
        </span>
        {useSysEx && (
          <span style={{ marginLeft: "10px", fontSize: "12px", color: "#666" }}>
            (with SysEx)
          </span>
        )}
        {isLoading && (
          <span style={{ marginLeft: "10px", color: "blue" }}>Loading...</span>
        )}
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "15px" }}>Error: {error}</div>
      )}

      <button
        onClick={requestPermissions}
        disabled={isLoading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#9C27B0",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        Request MIDI Access
      </button>

      <div style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
        <strong>What this does:</strong> Requests access to MIDI devices. Useful
        for music applications.
        <br />
        <strong>Browser Support:</strong> Chrome, Edge (Firefox and Safari have
        limited support)
      </div>
    </div>
  );
};

// Camera and Microphone example
const CameraAndMicrophoneExample: React.FC = () => {
  const {
    permissionStatus: cameraStatus,
    requestPermissions: requestCamera,
    isLoading: cameraLoading,
  } = usePermission("camera");

  const {
    permissionStatus: micStatus,
    requestPermissions: requestMic,
    isLoading: micLoading,
  } = usePermission("microphone");

  const {
    permissionStatus: bothStatus,
    requestPermissions: requestBoth,
    isLoading: bothLoading,
  } = usePermission(["camera", "microphone"]);

  return (
    <div
      style={{
        marginBottom: "40px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h2>📹 Camera & Microphone Permissions</h2>
      <p>Examples of individual and combined media device permissions.</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <div>
          <h4>📷 Camera Only</h4>
          <div style={{ marginBottom: "10px" }}>
            Status:{" "}
            <span
              style={{
                color:
                  cameraStatus[0]?.state === "granted"
                    ? "green"
                    : cameraStatus[0]?.state === "denied"
                    ? "red"
                    : "orange",
                fontWeight: "bold",
              }}
            >
              {cameraStatus[0]?.state || "checking..."}
            </span>
          </div>
          <button
            onClick={requestCamera}
            disabled={cameraLoading}
            style={{
              padding: "8px 16px",
              backgroundColor: "#E91E63",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: cameraLoading ? "not-allowed" : "pointer",
              opacity: cameraLoading ? 0.6 : 1,
              width: "100%",
            }}
          >
            {cameraLoading ? "Requesting..." : "Request Camera"}
          </button>
        </div>

        <div>
          <h4>🎤 Microphone Only</h4>
          <div style={{ marginBottom: "10px" }}>
            Status:{" "}
            <span
              style={{
                color:
                  micStatus[0]?.state === "granted"
                    ? "green"
                    : micStatus[0]?.state === "denied"
                    ? "red"
                    : "orange",
                fontWeight: "bold",
              }}
            >
              {micStatus[0]?.state || "checking..."}
            </span>
          </div>
          <button
            onClick={requestMic}
            disabled={micLoading}
            style={{
              padding: "8px 16px",
              backgroundColor: "#FF5722",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: micLoading ? "not-allowed" : "pointer",
              opacity: micLoading ? 0.6 : 1,
              width: "100%",
            }}
          >
            {micLoading ? "Requesting..." : "Request Microphone"}
          </button>
        </div>

        <div>
          <h4>📹🎤 Both Together</h4>
          <div style={{ marginBottom: "10px" }}>
            Camera:{" "}
            <span
              style={{
                color:
                  bothStatus[0]?.state === "granted"
                    ? "green"
                    : bothStatus[0]?.state === "denied"
                    ? "red"
                    : "orange",
                fontWeight: "bold",
              }}
            >
              {bothStatus[0]?.state || "checking..."}
            </span>
            <br />
            Mic:{" "}
            <span
              style={{
                color:
                  bothStatus[1]?.state === "granted"
                    ? "green"
                    : bothStatus[1]?.state === "denied"
                    ? "red"
                    : "orange",
                fontWeight: "bold",
              }}
            >
              {bothStatus[1]?.state || "checking..."}
            </span>
          </div>
          <button
            onClick={requestBoth}
            disabled={bothLoading}
            style={{
              padding: "8px 16px",
              backgroundColor: "#3F51B5",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: bothLoading ? "not-allowed" : "pointer",
              opacity: bothLoading ? 0.6 : 1,
              width: "100%",
            }}
          >
            {bothLoading ? "Requesting..." : "Request Both"}
          </button>
        </div>
      </div>

      <div style={{ fontSize: "14px", color: "#666" }}>
        <strong>What this does:</strong> Requests camera and/or microphone
        access for video/audio applications.
      </div>
    </div>
  );
};

// Notifications permission example
const NotificationPermissionExample: React.FC = () => {
  const { permissionStatus, requestPermissions, isLoading, error } =
    usePermission("notifications");
  const [notification, setNotification] = useState<Notification | null>(null);

  const sendTestNotification = () => {
    if (permissionStatus[0]?.state === "granted") {
      const notif = new Notification("Test Notification", {
        body: "This is a test notification from usePermission hook!",
        icon: "/favicon.ico",
        badge: "/favicon.ico",
      });
      setNotification(notif);

      // Auto close after 5 seconds
      setTimeout(() => {
        notif.close();
        setNotification(null);
      }, 5000);
    }
  };

  return (
    <div
      style={{
        marginBottom: "40px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h2>🔔 Notification Permission</h2>
      <p>
        Example requesting notification permission and sending test
        notifications.
      </p>

      <div style={{ marginBottom: "15px" }}>
        <strong>Status:</strong>
        <span
          style={{
            color:
              permissionStatus[0]?.state === "granted"
                ? "green"
                : permissionStatus[0]?.state === "denied"
                ? "red"
                : "orange",
            marginLeft: "10px",
            fontWeight: "bold",
          }}
        >
          {permissionStatus[0]?.state || "checking..."}
        </span>
        {isLoading && (
          <span style={{ marginLeft: "10px", color: "blue" }}>Loading...</span>
        )}
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "15px" }}>Error: {error}</div>
      )}

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
          onClick={requestPermissions}
          disabled={isLoading || permissionStatus[0]?.state === "granted"}
          style={{
            padding: "10px 20px",
            backgroundColor:
              permissionStatus[0]?.state === "granted" ? "#4CAF50" : "#FF9800",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {permissionStatus[0]?.state === "granted"
            ? "✓ Permission Granted"
            : "Request Notifications"}
        </button>

        <button
          onClick={sendTestNotification}
          disabled={permissionStatus[0]?.state !== "granted" || !!notification}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor:
              permissionStatus[0]?.state !== "granted"
                ? "not-allowed"
                : "pointer",
            opacity: permissionStatus[0]?.state !== "granted" ? 0.6 : 1,
          }}
        >
          {notification ? "Notification Sent" : "Send Test Notification"}
        </button>
      </div>

      <div style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
        <strong>What this does:</strong> Requests permission to show browser
        notifications and sends a test notification.
      </div>
    </div>
  );
};

// Real-time permission status monitoring
const PermissionStatusMonitorExample: React.FC = () => {
  const { permissionStatus, checkPermissions, isLoading } = usePermission([
    "geolocation",
    "notifications",
    "camera",
    "microphone",
  ]);

  const permissions = ["geolocation", "notifications", "camera", "microphone"];

  const getStatusIcon = (state: string) => {
    switch (state) {
      case "granted":
        return "✅";
      case "denied":
        return "❌";
      case "prompt":
        return "⚠️";
      default:
        return "❓";
    }
  };

  const getStatusColor = (state: string) => {
    switch (state) {
      case "granted":
        return "#4CAF50";
      case "denied":
        return "#F44336";
      case "prompt":
        return "#FF9800";
      default:
        return "#9E9E9E";
    }
  };

  return (
    <div
      style={{
        marginBottom: "40px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h2>📊 Permission Status Monitor</h2>
      <p>
        Real-time monitoring of multiple permission states with automatic
        updates.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        {permissions.map((permission, index) => (
          <div
            key={permission}
            style={{
              padding: "15px",
              border: `2px solid ${getStatusColor(
                permissionStatus[index]?.state || ""
              )}`,
              borderRadius: "8px",
              textAlign: "center",
              backgroundColor: `${getStatusColor(
                permissionStatus[index]?.state || ""
              )}10`,
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>
              {getStatusIcon(permissionStatus[index]?.state || "")}
            </div>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "4px",
                textTransform: "capitalize",
              }}
            >
              {permission}
            </div>
            <div
              style={{
                color: getStatusColor(permissionStatus[index]?.state || ""),
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: "12px",
              }}
            >
              {permissionStatus[index]?.state || "checking..."}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={checkPermissions}
        disabled={isLoading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#607D8B",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        {isLoading ? "Refreshing..." : "Refresh All Status"}
      </button>

      <div style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
        <strong>What this does:</strong> Continuously monitors permission states
        and automatically updates when permissions change.
        <br />
        <strong>Tip:</strong> Try changing permissions in your browser settings
        to see real-time updates!
      </div>
    </div>
  );
};

export default UsePermissionExamples;
