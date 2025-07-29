import { isMobile, useClickOutside } from "light-hooks";
import { useState } from "react";
import { CountdownBasicExample, CountdownControlExample, CountdownDateExample, CountdownLongExample, CountdownTimerExample } from "./CountdownExamples";

// Basic usage example
function BasicExample() {
  const mobile = isMobile();

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>Basic Example</h3>
      <p>Current status: {mobile ? "📱 Mobile" : "🖥️ Desktop"}</p>
      <p>
        Screen is {mobile ? "less than" : "greater than or equal to"} 768px wide
      </p>
    </div>
  );
}

// Custom breakpoint example
function CustomBreakpointExample() {
  const mobile640 = isMobile({ breakpoint: 640 });
  const mobile1024 = isMobile({ breakpoint: 1024 });

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>Custom Breakpoint Example</h3>
      <p>Mobile (640px): {mobile640 ? "✅ Yes" : "❌ No"}</p>
      <p>Tablet (1024px): {mobile1024 ? "✅ Yes" : "❌ No"}</p>
    </div>
  );
}

// Responsive navigation example
function ResponsiveNavigation() {
  const mobile = isMobile();

  const navStyle = {
    display: "flex",
    flexDirection: mobile ? "column" : "row",
    gap: mobile ? "5px" : "20px",
    padding: mobile ? "10px" : "20px",
    backgroundColor: "#f0f0f0",
    margin: "10px",
  };

  const linkStyle = {
    padding: mobile ? "8px 12px" : "10px 15px",
    backgroundColor: "#007bff",
    color: "white",
    textDecoration: "none",
    borderRadius: "4px",
    textAlign: "center",
  };

  return (
    <div>
      <h3>Responsive Navigation Example</h3>
      <nav style={navStyle}>
        <a href="#home" style={linkStyle}>
          Home
        </a>
        <a href="#about" style={linkStyle}>
          About
        </a>
        <a href="#services" style={linkStyle}>
          Services
        </a>
        <a href="#contact" style={linkStyle}>
          Contact
        </a>
      </nav>
    </div>
  );
}

// Click outside example - Modal
function ModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useClickOutside(() => setIsOpen(false));

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>useClickOutside Example - Modal</h3>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Open Modal
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            ref={modalRef}
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "8px",
              maxWidth: "400px",
              width: "90%",
            }}
          >
            <h4>Modal Title</h4>
            <p>
              Click outside this modal to close it, or use the button below.
            </p>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Click outside example - Dropdown
function DropdownExample() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useClickOutside(() => setIsOpen(false), {
    enabled: isOpen, // Only listen when dropdown is open
  });

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>useClickOutside Example - Dropdown</h3>
      <div style={{ position: "relative", display: "inline-block" }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Toggle Dropdown {isOpen ? "▲" : "▼"}
        </button>

        {isOpen && (
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "10px",
              minWidth: "200px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              zIndex: 1000,
            }}
          >
            <div style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
              Option 1
            </div>
            <div style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
              Option 2
            </div>
            <div style={{ padding: "8px" }}>Option 3</div>
          </div>
        )}
      </div>
    </div>
  );
}


// Main App component
function App() {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1>Light Hooks Examples</h1>
      <p>
        Resize your window and interact with components to see the hooks in
        action!
      </p>

      <h2>isMobile Hook</h2>
      <BasicExample />
      <CustomBreakpointExample />
      <ResponsiveNavigation />

      <h2>useClickOutside Hook</h2>
      <ModalExample />
      <DropdownExample />

      <h2>useCountdown Hook</h2>
      <CountdownBasicExample />
      <CountdownControlExample />
      <CountdownDateExample />
      <CountdownLongExample />
      <CountdownTimerExample />

      <div
        style={{ padding: "20px", backgroundColor: "#f9f9f9", margin: "10px" }}
      >
        <h3>Current Window Information</h3>
        <p>
          Window width:{" "}
          {typeof window !== "undefined" ? window.innerWidth : "Unknown"}px
        </p>
        <p>
          Window height:{" "}
          {typeof window !== "undefined" ? window.innerHeight : "Unknown"}px
        </p>
      </div>
    </div>
  );
}

export default App;
