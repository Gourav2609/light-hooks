import React, { useState } from "react";
import { useHotKey } from "light-hooks";

// Simple Key Binding Example
export const SimpleKeyExample: React.FC = () => {
  const [message, setMessage] = useState<string>("");

  useHotKey("Enter", () => {
    setMessage("Enter key pressed!");
    setTimeout(() => setMessage(""), 2000);
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
      <h3>🎯 Simple Key Binding</h3>
      <div
        style={{
          padding: "10px",
          borderRadius: "3px",
          minHeight: "40px",
        }}
      >
        <strong>Status:</strong> {message || "Press Enter to trigger action"}
      </div>
      <p style={{ margin: "10px 0 0 0", fontSize: "14px", color: "#666" }}>
        Press <code>Enter</code> key anywhere on the page
      </p>
    </div>
  );
};

// Modifier Key Combination Example
export const ModifierKeyExample: React.FC = () => {
  const [message, setMessage] = useState<string>("");

  useHotKey({ key: "s", modifiers: ["ctrl"], preventDefault: true }, () => {
    setMessage("Ctrl+S pressed - Save action triggered!");
    setTimeout(() => setMessage(""), 2000);
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
      <h3>⌨️ Modifier Key Combination</h3>
      <div
        style={{
          padding: "10px",
          borderRadius: "3px",
          minHeight: "40px",
        }}
      >
        <strong>Status:</strong> {message || "Press Ctrl+S to save"}
      </div>
      <p style={{ margin: "10px 0 0 0", fontSize: "14px", color: "#666" }}>
        Press <code>Ctrl+S</code> - This prevents the default browser save
        dialog
      </p>
    </div>
  );
};

// Multiple Key Combinations Example
export const MultipleKeyExample: React.FC = () => {
  const [message, setMessage] = useState<string>("");

  useHotKey(
    [
      { key: "c", modifiers: ["ctrl"] },
      { key: "c", modifiers: ["meta"] }, // Cmd+C on Mac
    ],
    () => {
      setMessage("Copy shortcut pressed!");
      setTimeout(() => setMessage(""), 2000);
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
      <h3>🔄 Cross-Platform Key Combinations</h3>
      <div
        style={{
          padding: "10px",
          borderRadius: "3px",
          minHeight: "40px",
        }}
      >
        <strong>Status:</strong>{" "}
        {message || "Press Ctrl+C (or Cmd+C on Mac) to copy"}
      </div>
      <p style={{ margin: "10px 0 0 0", fontSize: "14px", color: "#666" }}>
        Works with both <code>Ctrl+C</code> (Windows/Linux) and{" "}
        <code>Cmd+C</code> (Mac)
      </p>
    </div>
  );
};

// Function Key Example
export const FunctionKeyExample: React.FC = () => {
  const [message, setMessage] = useState<string>("");

  useHotKey("F1", () => {
    setMessage("F1 pressed - Help triggered!");
    setTimeout(() => setMessage(""), 2000);
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
      <h3>🔧 Function Key</h3>
      <div
        style={{
          padding: "10px",
          borderRadius: "3px",
          minHeight: "40px",
        }}
      >
        <strong>Status:</strong> {message || "Press F1 for help"}
      </div>
      <p style={{ margin: "10px 0 0 0", fontSize: "14px", color: "#666" }}>
        Press <code>F1</code> to trigger help action
      </p>
    </div>
  );
};

// Arrow Keys Navigation Example
export const ArrowKeysExample: React.FC = () => {
  const [counter, setCounter] = useState<number>(0);

  useHotKey("ArrowUp", () => {
    setCounter((prev) => prev + 1);
  });

  useHotKey("ArrowDown", () => {
    setCounter((prev) => prev - 1);
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
      <h3>🔼 Arrow Key Navigation</h3>
      <div
        style={{
          padding: "15px",
          borderRadius: "3px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
          Counter: {counter}
        </div>
      </div>
      <p style={{ margin: "10px 0 0 0", fontSize: "14px", color: "#666" }}>
        Use <code>↑</code> and <code>↓</code> arrow keys to change the counter
      </p>
    </div>
  );
};

// Conditional Hotkey Example
export const ConditionalHotkeyExample: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  useHotKey(
    { key: "r", modifiers: ["ctrl"], preventDefault: true },
    () => {
      setMessage("Ctrl+R pressed - Refresh action!");
      setTimeout(() => setMessage(""), 2000);
    },
    { enabled: isEnabled }
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
      <h3>🎛️ Conditional Hotkey (Enable/Disable)</h3>
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => setIsEnabled(e.target.checked)}
          />
          Enable Ctrl+R hotkey
        </label>
      </div>
      <div
        style={{
          padding: "10px",
          borderRadius: "3px",
          minHeight: "40px",
        }}
      >
        <strong>Status:</strong>{" "}
        {message ||
          (isEnabled ? "Press Ctrl+R to refresh" : "Hotkey is disabled")}
      </div>
      <p style={{ margin: "10px 0 0 0", fontSize: "14px", color: "#666" }}>
        Toggle the checkbox to enable/disable <code>Ctrl+R</code> functionality
      </p>
    </div>
  );
};

// Clear Action Example
export const ClearActionExample: React.FC = () => {
  const [message, setMessage] = useState<string>(
    "Press Escape to clear this message"
  );

  useHotKey("Escape", () => {
    setMessage("");
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
      <h3>�️ Clear Action</h3>
      <div
        style={{
          padding: "10px",
          borderRadius: "3px",
          minHeight: "40px",
        }}
      >
        <strong>Message:</strong>{" "}
        {message || "Message cleared! Press any key to reset."}
      </div>
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={() => setMessage("Press Escape to clear this message")}
          style={{
            padding: "8px 16px",

            color: "white",
            border: "none",
            borderRadius: "3px",
            cursor: "pointer",
          }}
        >
          Reset Message
        </button>
      </div>
      <p style={{ margin: "10px 0 0 0", fontSize: "14px", color: "#666" }}>
        Press <code>Escape</code> to clear the message
      </p>
    </div>
  );
};

// Alt+Number Shortcuts Example
export const AltNumberExample: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(1);

  useHotKey({ key: "1", modifiers: ["alt"] }, () => {
    setActiveTab(1);
  });

  useHotKey({ key: "2", modifiers: ["alt"] }, () => {
    setActiveTab(2);
  });

  useHotKey({ key: "3", modifiers: ["alt"] }, () => {
    setActiveTab(3);
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
      <h3>🔢 Alt+Number Tab Shortcuts</h3>
      <div
        style={{
          padding: "15px",
          borderRadius: "3px",
        }}
      >
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          {[1, 2, 3].map((tab) => (
            <div
              key={tab}
              style={{
                padding: "8px 16px",

                color: activeTab === tab ? "white" : "#333",
                borderRadius: "3px",
                cursor: "pointer",
              }}
              onClick={() => setActiveTab(tab)}
            >
              Tab {tab}
            </div>
          ))}
        </div>
        <div
          style={{
            padding: "10px",

            borderRadius: "3px",
            border: "1px solid #dee2e6",
          }}
        >
          <strong>Active Tab:</strong> Tab {activeTab} content is displayed here
        </div>
      </div>
      <p style={{ margin: "10px 0 0 0", fontSize: "14px", color: "#666" }}>
        Press <code>Alt+1</code>, <code>Alt+2</code>, or <code>Alt+3</code> to
        switch tabs
      </p>
    </div>
  );
};

// Input Field Protection Example
export const InputFieldExample: React.FC = () => {
  const [message, setMessage] = useState<string>("");

  useHotKey("t", () => {
    setMessage("Letter 't' hotkey triggered!");
    setTimeout(() => setMessage(""), 2000);
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
      <h3>🛡️ Input Field Protection</h3>
      <div
        style={{
          padding: "10px",
          borderRadius: "3px",
          minHeight: "40px",
          marginBottom: "15px",
        }}
      >
        <strong>Status:</strong> {message || "Press 't' key to trigger hotkey"}
      </div>
      <div>
        <label
          style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}
        >
          Test input field (hotkeys ignored here):
        </label>
        <input
          type="text"
          placeholder="Type 't' here - hotkey won't trigger"
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "3px",
          }}
        />
      </div>
      <p style={{ margin: "10px 0 0 0", fontSize: "14px", color: "#666" }}>
        Press <code>t</code> outside the input field to trigger hotkey, or
        inside to type normally
      </p>
    </div>
  );
};

// Main Examples Component
export const UseHotKeyExamples: React.FC = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "800px" }}>
      <h2>🔥 useHotKey Hook Examples</h2>
      <p style={{ marginBottom: "30px", color: "#666" }}>
        Comprehensive examples demonstrating different hotkey patterns and
        configurations.
      </p>

      <SimpleKeyExample />
      <ModifierKeyExample />
      <MultipleKeyExample />
      <FunctionKeyExample />
      <ArrowKeysExample />
      <ConditionalHotkeyExample />
      <ClearActionExample />
      <AltNumberExample />
      <InputFieldExample />

      <div
        style={{
          marginTop: "30px",
          padding: "15px",

          borderRadius: "5px",
          fontSize: "14px",
        }}
      >
        <h4>💡 Pro Tips:</h4>
        <ul style={{ margin: "10px 0 0 0", paddingLeft: "20px" }}>
          <li>Hotkeys are automatically ignored when typing in input fields</li>
          <li>
            Use <code>preventDefault: true</code> to override browser shortcuts
          </li>
          <li>Combine multiple modifier keys for complex shortcuts</li>
          <li>Use arrays to support cross-platform key combinations</li>
          <li>
            Toggle <code>enabled</code> option to dynamically control hotkeys
          </li>
        </ul>
      </div>
    </div>
  );
};
