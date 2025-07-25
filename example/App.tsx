import React from 'react';
import { isMobile } from 'light-hooks';

// Basic usage example
function BasicExample() {
  const mobile = isMobile();

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Basic Example</h3>
      <p>Current status: {mobile ? '📱 Mobile' : '🖥️ Desktop'}</p>
      <p>Screen is {mobile ? 'less than' : 'greater than or equal to'} 768px wide</p>
    </div>
  );
}

// Custom breakpoint example
function CustomBreakpointExample() {
  const mobile640 = isMobile({ breakpoint: 640 });
  const mobile1024 = isMobile({ breakpoint: 1024 });

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Custom Breakpoint Example</h3>
      <p>Mobile (640px): {mobile640 ? '✅ Yes' : '❌ No'}</p>
      <p>Tablet (1024px): {mobile1024 ? '✅ Yes' : '❌ No'}</p>
    </div>
  );
}

// Responsive navigation example
function ResponsiveNavigation() {
  const mobile = isMobile();

  const navStyle = {
    display: 'flex',
    flexDirection: mobile ? 'column' : 'row',
    gap: mobile ? '5px' : '20px',
    padding: mobile ? '10px' : '20px',
    backgroundColor: '#f0f0f0',
    margin: '10px',
  };

  const linkStyle = {
    padding: mobile ? '8px 12px' : '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    textAlign: 'center',
  };

  return (
    <div>
      <h3>Responsive Navigation Example</h3>
      <nav style={navStyle}>
        <a href="#home" style={linkStyle}>Home</a>
        <a href="#about" style={linkStyle}>About</a>
        <a href="#services" style={linkStyle}>Services</a>
        <a href="#contact" style={linkStyle}>Contact</a>
      </nav>
    </div>
  );
}

// Main App component
function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>isMobile Hook Examples</h1>
      <p>Resize your window to see the hook in action!</p>
      
      <BasicExample />
      <CustomBreakpointExample />
      <ResponsiveNavigation />
      
      <div style={{ padding: '20px', backgroundColor: '#f9f9f9', margin: '10px' }}>
        <h3>Current Window Information</h3>
        <p>Window width: {typeof window !== 'undefined' ? window.innerWidth : 'Unknown'}px</p>
        <p>Window height: {typeof window !== 'undefined' ? window.innerHeight : 'Unknown'}px</p>
      </div>
    </div>
  );
}

export default App;
