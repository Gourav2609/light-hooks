import React, { useState } from "react";
import { useClickOutside } from "light-hook";

// Click outside example - Modal
export function ModalExample() {
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
            ref={modalRef as React.RefObject<HTMLDivElement>}
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
export function DropdownExample() {
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
            ref={dropdownRef as React.RefObject<HTMLDivElement>}
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
