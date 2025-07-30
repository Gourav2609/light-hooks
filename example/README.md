# Light Hooks Examples

This folder contains examples of how to use the `light-hooks` package with the improved hooks.

## Running the Examples

To use these examples in a React project:

1. Install the hook package:

```bash
npm install light-hooks
```

2. Copy the example files to your React project:
   - `App.tsx` - Main examples app that imports all hook examples
   - `IsMobileExamples.tsx` - isMobile hook examples
   - `UseClickOutsideExamples.tsx` - useClickOutside hook examples
   - `CountdownExamples.tsx` - useCountdown hook examples
   - `UsePingExamples.tsx` - usePing hook examples

3. Import and use the components in your app

## Examples Included

### isMobile Hook

- **Basic Example**: Simple mobile detection with default 768px breakpoint
- **Custom Breakpoint Example**: Using custom breakpoints (640px and 1024px)
- **Responsive Navigation**: Real-world example of responsive navigation bar

### useClickOutside Hook

- **Modal Example**: Click outside to close modal dialog
- **Dropdown Example**: Click outside to close dropdown menu with conditional listening

### useCountdown Hook

- **Basic Countdown**: Simple 60-second countdown with formatted time display
- **Countdown with Controls**: Start, pause, reset functionality with status indicators
- **Date Countdown**: Countdown to specific future date (2 minutes from page load)
- **Long Countdown**: Extended countdown showing days, hours, minutes, seconds (25+ hours)
- **Timer Example**: Interactive timer with preset durations and completion alerts

### usePing Hook

- **Basic Ping**: Simple network latency monitoring with status indicators
- **Custom Interval Ping**: Ping with custom intervals (2 seconds) to different endpoints
- **Multiple URL Monitoring**: Monitor multiple services simultaneously (Google, GitHub, HTTPBin)
- **Manual Ping**: Example with auto-start disabled for manual control

## Features Demonstrated

[See isMobile example](./IsMobileExamples.tsx)

- Window resize detection
- Multiple breakpoint usage
- Conditional styling
- Real-time updates

[See useClickOutside example](./UseClickOutsideExamples.tsx)

- Modal and dropdown implementations
- Conditional event listening
- Ref-based element targeting
- Outside click detection

[See useCountdown example](./CountdownExamples.tsx)

- Basic countdown functionality from seconds or target date
- Start, pause, reset controls
- Completion callbacks and status tracking
- Formatted time output (days, hours, minutes, seconds)
- Custom update intervals

[See usePing example](./UsePingExamples.tsx)

- Network latency monitoring
- Online/offline status detection
- Custom ping intervals
- Multiple endpoint monitoring
- Loading states and error handling

## API Usage Examples

### isMobile Usage

```tsx
import React from 'react';
import { isMobile } from 'light-hooks';

function MyComponent() {
  const mobile = isMobile(); // Uses default 768px breakpoint

  return (
    <div>
      {mobile ? (
        <h1>📱 Mobile View</h1>
      ) : (
        <h1>🖥️ Desktop View</h1>
      )}
    </div>
  );
}
```

### isMobile Custom Breakpoint

```tsx
import React from 'react';
import { isMobile } from 'light-hooks';

function MyComponent() {
  const mobile = isMobile({ breakpoint: 640 }); // Custom breakpoint at 640px

  return (
    <div>
      {mobile ? 'Small screen detected' : 'Large screen detected'}
    </div>
  );
}
```

### useClickOutside Usage

```tsx
import { useClickOutside } from 'light-hooks';

const [isOpen, setIsOpen] = useState(false);
const ref = useClickOutside(() => setIsOpen(false), {
  enabled: isOpen  // Optional: only listen when needed
});

return <div ref={ref}>Content that closes on outside click</div>;
```

### useCountdown Basic Usage

```tsx
import { useCountdown } from 'light-hooks';

// Simple countdown
const { timeLeft, formattedTime } = useCountdown({ initialSeconds: 60 });

// Countdown to date
const { timeLeft, isCompleted } = useCountdown({ 
  targetDate: new Date('2024-12-31') 
});
```

### useCountdown Advanced Usage

```tsx
const {
  timeLeft,        // Time remaining in seconds
  isActive,        // Whether countdown is running
  isCompleted,     // Whether countdown has finished
  start,           // Function to start countdown
  pause,           // Function to pause countdown
  reset,           // Function to reset countdown
  formattedTime    // Object with {days, hours, minutes, seconds}
} = useCountdown({
  initialSeconds: 300,
  autoStart: false,
  onComplete: () => console.log('Time\'s up!'),
  interval: 1000
});
```

### usePing Basic Usage

```tsx
import { usePing } from 'light-hooks';

// Simple ping monitoring
const { latency, isLive, isLoading } = usePing("https://api.example.com");

// Custom interval and fallback
const { latency, isLive, lastPingTime } = usePing({
  url: "https://api.example.com",
  interval: 3000,           // Ping every 3 seconds
  fallbackLatency: 999,     // Show 999ms when offline
  autoStart: true           // Start automatically
});
```

### usePing Advanced Usage

```tsx
const {
  latency,        // Current latency in milliseconds
  isLive,         // Whether the endpoint is reachable
  isLoading,      // Whether a ping is currently in progress
  lastPingTime,   // Date of last ping attempt
  ping            // Manual ping function
} = usePing({
  url: "https://api.example.com",
  interval: 5000,           // Optional: Default 5000ms
  fallbackLatency: 0,       // Optional: Default 0ms
  autoStart: false          // Optional: Default true
});

// Manual ping
const handlePing = () => {
  ping();
};
```
