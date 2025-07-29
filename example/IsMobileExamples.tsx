import { isMobile } from "light-hook";

// Basic usage example
export function BasicExample() {
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
export function CustomBreakpointExample() {
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
export function ResponsiveNavigation() {
  const mobile = isMobile();

  const navStyle = {
    display: "flex",
    flexDirection: mobile ? ("column" as const) : ("row" as const),
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
    textAlign: "center" as const,
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
