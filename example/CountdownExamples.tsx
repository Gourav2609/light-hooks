import { useCountdown } from "light-hooks";
import { useState } from "react";

// Basic countdown from seconds
export function CountdownBasicExample() {
  const { timeLeft, formattedTime } = useCountdown({ initialSeconds: 60 });

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>Basic Countdown (60 seconds)</h3>
      <p>Time remaining: {timeLeft} seconds</p>
      <p>
        Formatted: {formattedTime.minutes}:
        {formattedTime.seconds.toString().padStart(2, "0")}
      </p>
    </div>
  );
}

// Countdown with controls
export function CountdownControlExample() {
  const {
    timeLeft,
    isActive,
    isCompleted,
    start,
    pause,
    reset,
    formattedTime,
  } = useCountdown({
    initialSeconds: 30,
    autoStart: false,
    onComplete: () => alert("Countdown completed!"),
  });

  const buttonStyle = {
    margin: "5px",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
  };

  const disabledStyle = {
    ...buttonStyle,
    backgroundColor: "#6c757d",
    cursor: "not-allowed",
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>Countdown with Controls (30 seconds)</h3>
      <p>Time remaining: {timeLeft} seconds</p>
      <p>
        Status:{" "}
        {isCompleted ? "Completed ✅" : isActive ? "Running ⏱️" : "Paused ⏸️"}
      </p>
      <p>
        Formatted: {formattedTime.minutes}:
        {formattedTime.seconds.toString().padStart(2, "0")}
      </p>
      <div>
        <button
          onClick={start}
          disabled={isActive || isCompleted}
          style={isActive || isCompleted ? disabledStyle : buttonStyle}
        >
          Start
        </button>
        <button
          onClick={pause}
          disabled={!isActive}
          style={!isActive ? disabledStyle : buttonStyle}
        >
          Pause
        </button>
        <button onClick={reset} style={buttonStyle}>
          Reset
        </button>
      </div>
    </div>
  );
}

// Countdown to specific date
export function CountdownDateExample() {
  const [targetDate] = useState(new Date(Date.now() + 2 * 60 * 1000)); // 2 minutes from now
  const { timeLeft, formattedTime, isCompleted } = useCountdown({ targetDate });

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>Countdown to Date (2 minutes from page load)</h3>
      <p>Target: {targetDate.toLocaleTimeString()}</p>
      <p>Time remaining: {timeLeft} seconds</p>
      <p>
        Formatted: {formattedTime.minutes}:
        {formattedTime.seconds.toString().padStart(2, "0")}
      </p>
      {isCompleted && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          🎉 Target date reached!
        </p>
      )}
    </div>
  );
}

// Long countdown with days, hours, minutes, seconds
export function CountdownLongExample() {
  const { formattedTime, timeLeft, isActive } = useCountdown({
    initialSeconds: 90061, // 1 day, 1 hour, 1 minute, 1 second
  });

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>Long Countdown (25+ hours)</h3>
      <p>Total seconds remaining: {timeLeft}</p>
      <div style={{ fontSize: "24px", fontWeight: "bold", color: "#007bff" }}>
        {formattedTime.days}d {formattedTime.hours}h {formattedTime.minutes}m{" "}
        {formattedTime.seconds}s
      </div>
      <p>Status: {isActive ? "Active" : "Inactive"}</p>
    </div>
  );
}

// Timer/Stopwatch style countdown
export function CountdownTimerExample() {
  const [duration, setDuration] = useState(10);
  const {
    timeLeft,
    isActive,
    isCompleted,
    start,
    pause,
    reset,
    formattedTime,
  } = useCountdown({
    initialSeconds: duration,
    autoStart: false,
    onComplete: () => {
      // Play a sound or show notification
      console.log("Timer finished!");
    },
  });

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
    // Reset with new duration
    reset();
  };

  const timerStyle = {
    fontSize: "48px",
    fontWeight: "bold",
    color: timeLeft <= 5 && isActive ? "#dc3545" : "#007bff",
    fontFamily: "monospace",
    textAlign: "center" as const,
    margin: "20px 0",
  };

  const buttonStyle = {
    margin: "5px",
    padding: "12px 24px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        margin: "10px",
        textAlign: "center",
      }}
    >
      <h3>Timer Example</h3>

      <div>
        <label>Set duration: </label>
        <select
          value={duration}
          onChange={(e) => handleDurationChange(Number(e.target.value))}
          style={{ margin: "0 10px", padding: "5px" }}
        >
          <option value={5}>5 seconds</option>
          <option value={10}>10 seconds</option>
          <option value={30}>30 seconds</option>
          <option value={60}>1 minute</option>
          <option value={300}>5 minutes</option>
        </select>
      </div>

      <div style={timerStyle}>
        {formattedTime.minutes.toString().padStart(2, "0")}:
        {formattedTime.seconds.toString().padStart(2, "0")}
      </div>

      <div>
        {!isActive && !isCompleted && (
          <button
            onClick={start}
            style={{
              ...buttonStyle,
              backgroundColor: "#28a745",
              color: "white",
            }}
          >
            ▶️ Start
          </button>
        )}
        {isActive && (
          <button
            onClick={pause}
            style={{
              ...buttonStyle,
              backgroundColor: "#ffc107",
              color: "black",
            }}
          >
            ⏸️ Pause
          </button>
        )}
        <button
          onClick={reset}
          style={{ ...buttonStyle, backgroundColor: "#6c757d", color: "white" }}
        >
          🔄 Reset
        </button>
      </div>

      {isCompleted && (
        <div
          style={{
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "10px",
            borderRadius: "4px",
            marginTop: "10px",
            border: "1px solid #c3e6cb",
          }}
        >
          ⏰ Timer finished!
        </div>
      )}
    </div>
  );
}
