import React from "react";
import {
  BasicExample,
  CustomBreakpointExample,
  ResponsiveNavigation,
} from "./IsMobileExamples";
import { ModalExample, DropdownExample } from "./UseClickOutsideExamples";
import {
  CountdownBasicExample,
  CountdownControlExample,
  CountdownDateExample,
  CountdownLongExample,
  CountdownTimerExample,
} from "./CountdownExamples";
import {
  BasicPingExample,
  CustomIntervalPingExample,
  MultipleUrlPingExample,
  ManualPingExample,
} from "./UsePingExamples";
import { UseHotKeyExamples } from "./UseHotKeyExamples";
import { UseEventExamples } from "./UseEventExamples";

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

      <h2>usePing Hook</h2>
      <BasicPingExample />
      <CustomIntervalPingExample />
      <MultipleUrlPingExample />
      <ManualPingExample />

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

      {/* useHotKey Hook Examples */}
      <div
        style={{
          marginTop: "40px",
          borderTop: "2px solid #eee",
          paddingTop: "20px",
        }}
      >
        <UseHotKeyExamples />
      </div>

      {/* useEvent Hook Examples */}
      <div
        style={{
          marginTop: "40px",
          borderTop: "2px solid #eee",
          paddingTop: "20px",
        }}
      >
        <UseEventExamples />
      </div>
    </div>
  );
}

export default App;
