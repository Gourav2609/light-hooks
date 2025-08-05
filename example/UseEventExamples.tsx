import React, { useState } from "react";
import { useEvent } from "light-hooks";

// Simple Event Binding Example
export const SimpleEventExample: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);
  const [lastClicked, setLastClicked] = useState<string>("");

  useEvent(
    (e) => {
      const target = e.target as HTMLElement;
      setClickCount((prev) => prev + 1);
      setLastClicked(target.textContent || target.tagName);
    },
    "click",
    { targetElements: "button" }
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
      <h3>🎯 Simple Event Binding</h3>
      <div
        style={{
          background: "#f0f8ff",
          padding: "15px",
          borderRadius: "3px",
          marginBottom: "15px",
        }}
      >
        <p>
          <strong>Click Count:</strong> {clickCount}
        </p>
        <p>
          <strong>Last Clicked:</strong> {lastClicked || "None"}
        </p>
      </div>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
          style={{
            padding: "8px 16px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Button 1
        </button>
        <button
          style={{
            padding: "8px 16px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Button 2
        </button>
        <button
          style={{
            padding: "8px 16px",
            background: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Button 3
        </button>
      </div>
      <p style={{ margin: "10px 0 0 0", fontSize: "14px", color: "#666" }}>
        All buttons are automatically tracked with a single event listener
      </p>
    </div>
  );
};

// Multiple Events Example
export const MultipleEventsExample: React.FC = () => {
  const [events, setEvents] = useState<string[]>([]);

  useEvent(
    (e) => {
      const target = e.target as HTMLElement;
      const eventInfo = `${e.type} on ${target.tagName.toLowerCase()}#${
        target.id || "no-id"
      }`;
      setEvents((prev) => [eventInfo, ...prev].slice(0, 5));
    },
    [
      { event: "click", ids: ["click-target", "special-button"] },
      { event: "mouseover", targetElements: "div" },
      { event: "focus", targetElements: "input" },
    ],
    {}
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
      <h3>🔄 Multiple Events Example</h3>
      <div
        style={{
          background: "#fff8f0",
          padding: "15px",
          borderRadius: "3px",
          marginBottom: "15px",
          minHeight: "120px",
        }}
      >
        <h4>Recent Events:</h4>
        {events.length === 0 ? (
          <p style={{ color: "#666" }}>
            No events yet - interact with elements below
          </p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "14px" }}>
            {events.map((event, index) => (
              <li key={index}>{event}</li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button
          id="click-target"
          style={{
            padding: "8px 16px",
            background: "#6f42c1",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Click Target (ID: click-target)
        </button>
        <button
          id="special-button"
          style={{
            padding: "8px 16px",
            background: "#20c997",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Special Button (ID: special-button)
        </button>
        <div
          style={{
            padding: "10px",
            background: "#e9ecef",
            borderRadius: "3px",
            cursor: "pointer",
          }}
        >
          Hover over this div (mouseover event)
        </div>
        <input
          type="text"
          placeholder="Focus on this input"
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "3px",
          }}
        />
      </div>
      <p style={{ margin: "10px 0 0 0", fontSize: "14px", color: "#666" }}>
        Different events are tracked: click (on specific IDs), mouseover (on
        divs), focus (on inputs)
      </p>
    </div>
  );
};

// Event Delegation Example
export const EventDelegationExample: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Learn React", completed: false },
    { id: 2, text: "Build a todo app", completed: false },
    { id: 3, text: "Master useEvent hook", completed: false },
  ]);
  const [message, setMessage] = useState("");

  useEvent(
    (e) => {
      const target = e.target as HTMLElement;

      if (target.classList.contains("complete-btn")) {
        const taskId = parseInt(target.dataset.taskId || "0");
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        );
        setMessage(`Toggled task ${taskId}`);
      } else if (target.classList.contains("delete-btn")) {
        const taskId = parseInt(target.dataset.taskId || "0");
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
        setMessage(`Deleted task ${taskId}`);
      }

      setTimeout(() => setMessage(""), 2000);
    },
    "click",
    { targetElements: "button" }
  );

  const addTask = () => {
    const newTask = {
      id: Math.max(...tasks.map((t) => t.id), 0) + 1,
      text: `New task ${Date.now()}`,
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
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
      <h3>📋 Event Delegation Example (Todo List)</h3>
      {message && (
        <div
          style={{
            background: "#d4edda",
            padding: "8px",
            borderRadius: "3px",
            marginBottom: "15px",
            color: "#155724",
          }}
        >
          {message}
        </div>
      )}
      <div style={{ marginBottom: "15px" }}>
        <button
          onClick={addTask}
          style={{
            padding: "8px 16px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Add Task
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px",
              background: task.completed ? "#f8f9fa" : "white",
              border: "1px solid #dee2e6",
              borderRadius: "3px",
            }}
          >
            <span
              style={{
                flex: 1,
                textDecoration: task.completed ? "line-through" : "none",
                color: task.completed ? "#6c757d" : "inherit",
              }}
            >
              {task.text}
            </span>
            <button
              className="complete-btn"
              data-task-id={task.id}
              style={{
                padding: "4px 8px",
                background: task.completed ? "#ffc107" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "3px",
                fontSize: "12px",
              }}
            >
              {task.completed ? "Undo" : "Complete"}
            </button>
            <button
              className="delete-btn"
              data-task-id={task.id}
              style={{
                padding: "4px 8px",
                background: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "3px",
                fontSize: "12px",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <p style={{ margin: "10px 0 0 0", fontSize: "14px", color: "#666" }}>
        Single event listener handles all button clicks using event delegation
        and CSS classes
      </p>
    </div>
  );
};

// Advanced Options Example
export const AdvancedOptionsExample: React.FC = () => {
  const [scrollEvents, setScrollEvents] = useState(0);
  const [passiveEvents, setPassiveEvents] = useState(0);
  const [captureEvents, setCaptureEvents] = useState(0);

  // Passive scroll listener
  useEvent(
    () => {
      setScrollEvents((prev) => prev + 1);
    },
    {
      event: "scroll",
      ids: "scroll-container",
      options: { passive: true },
    },
    {}
  );

  // Passive wheel events
  useEvent(
    () => {
      setPassiveEvents((prev) => prev + 1);
    },
    {
      event: "wheel",
      ids: "passive-container",
      options: { passive: true },
    },
    {}
  );

  // Capture phase events
  useEvent(
    () => {
      setCaptureEvents((prev) => prev + 1);
    },
    {
      event: "click",
      ids: "capture-container",
      options: { capture: true },
    },
    {}
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
      <h3>⚙️ Advanced Options Example</h3>
      <div
        style={{
          background: "#f8f9fa",
          padding: "15px",
          borderRadius: "3px",
          marginBottom: "15px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "15px",
            textAlign: "center",
          }}
        >
          <div>
            <strong>Scroll Events</strong>
            <div style={{ fontSize: "24px", color: "#007bff" }}>
              {scrollEvents}
            </div>
            <small>(passive: true)</small>
          </div>
          <div>
            <strong>Wheel Events</strong>
            <div style={{ fontSize: "24px", color: "#28a745" }}>
              {passiveEvents}
            </div>
            <small>(passive: true)</small>
          </div>
          <div>
            <strong>Capture Events</strong>
            <div style={{ fontSize: "24px", color: "#dc3545" }}>
              {captureEvents}
            </div>
            <small>(capture: true)</small>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div
          id="scroll-container"
          style={{
            height: "80px",
            overflowY: "scroll",
            border: "2px solid #007bff",
            borderRadius: "3px",
            padding: "10px",
          }}
        >
          <p>Scroll this container (passive scroll events)</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <p>
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p>Ut enim ad minim veniam, quis nostrud exercitation.</p>
          <p>Duis aute irure dolor in reprehenderit in voluptate.</p>
        </div>

        <div
          id="passive-container"
          style={{
            height: "60px",
            border: "2px solid #28a745",
            borderRadius: "3px",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Use mouse wheel over this area (passive wheel events)
        </div>

        <div
          id="capture-container"
          style={{
            height: "60px",
            border: "2px solid #dc3545",
            borderRadius: "3px",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          Click anywhere in this area (capture phase events)
        </div>
      </div>

      <p style={{ margin: "10px 0 0 0", fontSize: "14px", color: "#666" }}>
        Demonstrates passive and capture event options for performance and event
        flow control
      </p>
    </div>
  );
};

// Dynamic Configuration Example
export const DynamicConfigExample: React.FC = () => {
  const [eventType, setEventType] = useState<"click" | "mouseover" | "focus">(
    "click"
  );
  const [targetType, setTargetType] = useState<"button" | "input" | "div">(
    "button"
  );
  const [eventCount, setEventCount] = useState(0);
  const [lastEvent, setLastEvent] = useState("");

  useEvent(
    (e) => {
      const target = e.target as HTMLElement;
      setEventCount((prev) => prev + 1);
      setLastEvent(`${e.type} on ${target.tagName.toLowerCase()}`);
    },
    eventType,
    { targetElements: targetType }
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
      <h3>🔄 Dynamic Configuration Example</h3>
      <div
        style={{
          background: "#fff3e0",
          padding: "15px",
          borderRadius: "3px",
          marginBottom: "15px",
        }}
      >
        <p>
          <strong>Event Count:</strong> {eventCount}
        </p>
        <p>
          <strong>Last Event:</strong> {lastEvent || "None"}
        </p>
        <p>
          <strong>Current Config:</strong> {eventType} events on {targetType}{" "}
          elements
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "15px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            Event Type:
          </label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value as any)}
            style={{
              padding: "4px",
              border: "1px solid #ccc",
              borderRadius: "3px",
            }}
          >
            <option value="click">Click</option>
            <option value="mouseover">Mouse Over</option>
            <option value="focus">Focus</option>
          </select>
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            Target Elements:
          </label>
          <select
            value={targetType}
            onChange={(e) => setTargetType(e.target.value as any)}
            style={{
              padding: "4px",
              border: "1px solid #ccc",
              borderRadius: "3px",
            }}
          >
            <option value="button">Buttons</option>
            <option value="input">Inputs</option>
            <option value="div">Divs</option>
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "end" }}>
          <button
            onClick={() => {
              setEventCount(0);
              setLastEvent("");
            }}
            style={{
              padding: "6px 12px",
              background: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "3px",
              fontSize: "12px",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button
          style={{
            padding: "8px 16px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Test Button 1
        </button>
        <button
          style={{
            padding: "8px 16px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Test Button 2
        </button>
        <input
          type="text"
          placeholder="Test input field"
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "3px",
          }}
        />
        <div
          style={{
            padding: "10px",
            background: "#e9ecef",
            borderRadius: "3px",
          }}
        >
          Test div element
        </div>
      </div>

      <p style={{ margin: "10px 0 0 0", fontSize: "14px", color: "#666" }}>
        Change the configuration above to see how event listeners are
        dynamically updated
      </p>
    </div>
  );
};

// Main Examples Component
export const UseEventExamples: React.FC = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "800px" }}>
      <h2>🎛️ useEvent Hook Examples</h2>
      <p style={{ marginBottom: "30px", color: "#666" }}>
        Advanced event handling with flexible targeting, delegation, and dynamic
        configuration.
      </p>

      <SimpleEventExample />
      <MultipleEventsExample />
      <EventDelegationExample />
      <AdvancedOptionsExample />
      <DynamicConfigExample />

      <div
        style={{
          marginTop: "30px",
          padding: "15px",
          background: "#e3f2fd",
          borderRadius: "5px",
          fontSize: "14px",
        }}
      >
        <h4>💡 Pro Tips:</h4>
        <ul style={{ margin: "10px 0 0 0", paddingLeft: "20px" }}>
          <li>
            Use event delegation for dynamic content and better performance
          </li>
          <li>Leverage passive listeners for scroll and wheel events</li>
          <li>Combine ID and tag targeting for precise element selection</li>
          <li>Use capture phase for global event handling</li>
          <li>
            Global config provides defaults while individual configs override
          </li>
          <li>All event listeners are automatically cleaned up on unmount</li>
        </ul>
      </div>
    </div>
  );
};
