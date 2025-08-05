import React, { useRef, useState } from "react";
import { useScroll } from "../src/useScroll";

const UseScrollExamples: React.FC = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>useScroll Hook Examples</h1>
      
      <BasicScrollExample />
      <ScrollLockExample />
      <ScrollDirectionExample />
      <ScrollVelocityExample />
      <ScrollControlsExample />
      <CustomElementScrollExample />
      <ScrollBoundaryExample />
    </div>
  );
};

// Basic scroll position tracking
const BasicScrollExample: React.FC = () => {
  const { scrollX, scrollY } = useScroll();

  return (
    <div style={{ marginBottom: "40px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>📍 Basic Scroll Position</h2>
      <p>Track current scroll position in real-time.</p>
      
      <div style={{ 
        padding: "15px", 
        backgroundColor: "#f5f5f5", 
        borderRadius: "4px",
        fontFamily: "monospace"
      }}>
        <div><strong>Scroll X:</strong> {scrollX}px</div>
        <div><strong>Scroll Y:</strong> {scrollY}px</div>
      </div>

      <div style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
        <strong>What this does:</strong> Displays current window scroll position that updates as you scroll.
      </div>
    </div>
  );
};

// Scroll lock functionality
const ScrollLockExample: React.FC = () => {
  const { scrollY, isLocked, setScrollLock } = useScroll();

  return (
    <div style={{ marginBottom: "40px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>🔒 Scroll Lock</h2>
      <p>Lock and unlock page scrolling while preserving scroll position.</p>

      <div style={{ marginBottom: "15px" }}>
        <strong>Current Status:</strong> 
        <span style={{ 
          color: isLocked ? 'red' : 'green',
          marginLeft: "10px",
          fontWeight: "bold"
        }}>
          {isLocked ? '🔒 LOCKED' : '🔓 UNLOCKED'}
        </span>
        <div style={{ marginTop: "5px", fontSize: "14px", color: "#666" }}>
          Scroll position: {scrollY}px
        </div>
      </div>

      <button 
        onClick={() => setScrollLock(!isLocked)}
        style={{
          padding: "10px 20px",
          backgroundColor: isLocked ? "#f44336" : "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        {isLocked ? 'Unlock Scroll' : 'Lock Scroll'}
      </button>

      <div style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
        <strong>What this does:</strong> Prevents page scrolling while maintaining the exact scroll position when unlocked.
      </div>
    </div>
  );
};

// Scroll direction tracking
const ScrollDirectionExample: React.FC = () => {
  const { direction, scrollY } = useScroll({ trackDirection: true });

  const getDirectionIcon = (dir: string | null) => {
    switch (dir) {
      case 'up': return '⬆️';
      case 'down': return '⬇️';
      case 'left': return '⬅️';
      case 'right': return '➡️';
      default: return '⏸️';
    }
  };

  const getDirectionColor = (dir: string | null) => {
    return dir ? '#2196F3' : '#9E9E9E';
  };

  return (
    <div style={{ marginBottom: "40px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>🧭 Scroll Direction</h2>
      <p>Track the direction of scrolling with real-time indicators.</p>

      <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
        <div style={{ 
          padding: "15px", 
          backgroundColor: "#f5f5f5", 
          borderRadius: "4px",
          textAlign: "center",
          minWidth: "100px"
        }}>
          <div style={{ fontSize: "24px", marginBottom: "5px" }}>
            {getDirectionIcon(direction.y)}
          </div>
          <div style={{ 
            color: getDirectionColor(direction.y),
            fontWeight: "bold",
            textTransform: "uppercase"
          }}>
            {direction.y || 'NONE'}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>Vertical</div>
        </div>

        <div style={{ 
          padding: "15px", 
          backgroundColor: "#f5f5f5", 
          borderRadius: "4px",
          textAlign: "center",
          minWidth: "100px"
        }}>
          <div style={{ fontSize: "24px", marginBottom: "5px" }}>
            {getDirectionIcon(direction.x)}
          </div>
          <div style={{ 
            color: getDirectionColor(direction.x),
            fontWeight: "bold",
            textTransform: "uppercase"
          }}>
            {direction.x || 'NONE'}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>Horizontal</div>
        </div>
      </div>

      <div style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
        Current position: {scrollY}px
      </div>

      <div style={{ fontSize: "14px", color: "#666" }}>
        <strong>What this does:</strong> Shows the direction you're scrolling in real-time. Try scrolling up/down and left/right!
      </div>
    </div>
  );
};

// Scroll velocity tracking
const ScrollVelocityExample: React.FC = () => {
  const { velocity, scrollY } = useScroll({ 
    trackVelocity: true,
    throttle: 8 // Higher frequency for velocity tracking
  });

  const getVelocityColor = (vel: number) => {
    const speed = Math.abs(vel);
    if (speed > 1000) return '#f44336'; // Fast
    if (speed > 500) return '#ff9800';  // Medium
    if (speed > 0) return '#4caf50';    // Slow
    return '#9e9e9e';                   // Stopped
  };

  const getSpeedLabel = (vel: number) => {
    const speed = Math.abs(vel);
    if (speed > 1000) return 'FAST';
    if (speed > 500) return 'MEDIUM';
    if (speed > 0) return 'SLOW';
    return 'STOPPED';
  };

  return (
    <div style={{ marginBottom: "40px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>⚡ Scroll Velocity</h2>
      <p>Monitor scroll speed in pixels per second.</p>

      <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
        <div style={{ 
          padding: "15px", 
          backgroundColor: "#f5f5f5", 
          borderRadius: "4px",
          textAlign: "center",
          minWidth: "120px"
        }}>
          <div style={{ 
            fontSize: "18px", 
            fontWeight: "bold", 
            color: getVelocityColor(velocity.y),
            marginBottom: "5px"
          }}>
            {Math.round(Math.abs(velocity.y))} px/s
          </div>
          <div style={{ 
            color: getVelocityColor(velocity.y),
            fontWeight: "bold",
            fontSize: "12px"
          }}>
            {getSpeedLabel(velocity.y)}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>Vertical Speed</div>
        </div>

        <div style={{ 
          padding: "15px", 
          backgroundColor: "#f5f5f5", 
          borderRadius: "4px",
          textAlign: "center",
          minWidth: "120px"
        }}>
          <div style={{ 
            fontSize: "18px", 
            fontWeight: "bold", 
            color: getVelocityColor(velocity.x),
            marginBottom: "5px"
          }}>
            {Math.round(Math.abs(velocity.x))} px/s
          </div>
          <div style={{ 
            color: getVelocityColor(velocity.x),
            fontWeight: "bold",
            fontSize: "12px"
          }}>
            {getSpeedLabel(velocity.x)}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>Horizontal Speed</div>
        </div>
      </div>

      <div style={{ fontSize: "14px", color: "#666" }}>
        <strong>What this does:</strong> Measures how fast you're scrolling. Try scrolling slowly vs quickly!
      </div>
    </div>
  );
};

// Scroll control functions
const ScrollControlsExample: React.FC = () => {
  const { scrollY, scrollToTop, scrollToBottom, scrollBy } = useScroll();

  return (
    <div style={{ marginBottom: "40px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>🎮 Scroll Controls</h2>
      <p>Programmatically control scroll position with smooth animations.</p>

      <div style={{ marginBottom: "15px" }}>
        <strong>Current Position:</strong> {scrollY}px
      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button 
          onClick={() => scrollToTop()}
          style={{
            padding: "10px 15px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          ⬆️ Scroll to Top
        </button>

        <button 
          onClick={() => scrollToBottom()}
          style={{
            padding: "10px 15px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          ⬇️ Scroll to Bottom
        </button>

        <button 
          onClick={() => scrollBy(0, 200)}
          style={{
            padding: "10px 15px",
            backgroundColor: "#FF9800",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          ⬇️ Scroll Down 200px
        </button>

        <button 
          onClick={() => scrollBy(0, -200)}
          style={{
            padding: "10px 15px",
            backgroundColor: "#9C27B0",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          ⬆️ Scroll Up 200px
        </button>
      </div>

      <div style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
        <strong>What this does:</strong> Provides smooth programmatic scrolling controls. All animations are smooth by default.
      </div>
    </div>
  );
};

// Custom element scroll tracking
const CustomElementScrollExample: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollX, scrollY, isAtTop, isAtBottom } = useScroll({ 
    target: scrollRef.current 
  });

  return (
    <div style={{ marginBottom: "40px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>📦 Custom Element Scroll</h2>
      <p>Track scroll position within a specific element instead of the window.</p>

      <div style={{ marginBottom: "15px" }}>
        <strong>Element Scroll Position:</strong> X: {scrollX}px, Y: {scrollY}px
      </div>

      <div 
        ref={scrollRef}
        style={{
          width: "100%",
          height: "200px",
          border: "2px solid #ddd",
          borderRadius: "4px",
          overflow: "auto",
          padding: "15px",
          backgroundColor: "#f9f9f9"
        }}
      >
        <div style={{ width: "800px", height: "600px", background: "linear-gradient(45deg, #e3f2fd, #bbdefb)" }}>
          <h3>Scrollable Content Area</h3>
          <p>This is a custom scrollable element. Try scrolling within this box!</p>
          <p>Position: {scrollY}px</p>
          <p>At top: {isAtTop ? '✅' : '❌'}</p>
          <p>At bottom: {isAtBottom ? '✅' : '❌'}</p>
          
          <div style={{ marginTop: "100px" }}>
            <h4>More content...</h4>
            <p>Scroll horizontally and vertically to see position tracking.</p>
          </div>
          
          <div style={{ marginTop: "200px" }}>
            <h4>Bottom area</h4>
            <p>You've reached the bottom section of this scrollable area!</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
        <strong>What this does:</strong> Tracks scroll position within a custom element instead of the entire window.
      </div>
    </div>
  );
};

// Scroll boundary detection
const ScrollBoundaryExample: React.FC = () => {
  const { scrollY, isAtTop, isAtBottom, scrollHeight } = useScroll();
  const scrollPercentage = scrollHeight > 0 ? Math.round((scrollY / (scrollHeight - window.innerHeight)) * 100) : 0;

  return (
    <div style={{ marginBottom: "40px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>🎯 Scroll Boundaries & Progress</h2>
      <p>Detect when at top/bottom of page and show scroll progress.</p>

      <div style={{ marginBottom: "20px" }}>
        <div style={{
          width: "100%",
          height: "20px",
          backgroundColor: "#f0f0f0",
          borderRadius: "10px",
          overflow: "hidden",
          position: "relative"
        }}>
          <div style={{
            width: `${Math.max(0, Math.min(100, scrollPercentage))}%`,
            height: "100%",
            backgroundColor: "#4CAF50",
            borderRadius: "10px",
            transition: "width 0.1s ease-out"
          }} />
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "12px",
            fontWeight: "bold",
            color: scrollPercentage > 50 ? "white" : "#333"
          }}>
            {Math.max(0, scrollPercentage)}%
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
        <div style={{ 
          padding: "10px 15px", 
          borderRadius: "4px",
          backgroundColor: isAtTop ? "#4CAF50" : "#f5f5f5",
          color: isAtTop ? "white" : "#333",
          fontWeight: "bold"
        }}>
          {isAtTop ? '✅' : '❌'} At Top
        </div>

        <div style={{ 
          padding: "10px 15px", 
          borderRadius: "4px",
          backgroundColor: isAtBottom ? "#4CAF50" : "#f5f5f5",
          color: isAtBottom ? "white" : "#333",
          fontWeight: "bold"
        }}>
          {isAtBottom ? '✅' : '❌'} At Bottom
        </div>
      </div>

      <div style={{ fontSize: "14px", color: "#666", lineHeight: "1.5" }}>
        <div><strong>Scroll Position:</strong> {scrollY}px</div>
        <div><strong>Total Height:</strong> {scrollHeight}px</div>
        <div><strong>Progress:</strong> {scrollPercentage}%</div>
      </div>

      <div style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
        <strong>What this does:</strong> Shows scroll progress and detects when you've reached the top or bottom of the page.
      </div>
    </div>
  );
};

export default UseScrollExamples;
