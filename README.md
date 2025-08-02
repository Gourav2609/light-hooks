# React Hooks Collection

A collection of useful React hooks for common React development patterns. Build responsive and interactive components with ease.

## Hooks Included

### `isMobile`
Detects mobile devices based on screen width with customizable breakpoints.

### `useClickOutside`
Detects clicks outside of a specified element - perfect for modals, dropdowns, and tooltips.

### `useCountdown`
A powerful countdown timer hook with multiple configuration options - perfect for timers, countdowns, and time-based features.

### `usePing`
Monitor network connectivity and measure latency to specific URLs with automatic or manual ping functionality.

### `useHotKey`
Handle keyboard shortcuts and hotkey combinations with modifier keys, custom options, and flexible configuration.

### `useEvent`
Handle multiple event listeners with flexible targeting options, event delegation, and performance optimizations.

### `useLocalStorage`
Persist state to localStorage with automatic JSON serialization, SSR safety, and cross-tab synchronization.

## Features

- 🚀 **Lightweight**: Minimal bundle size
- 📱 **Responsive**: Automatically updates on window resize
- ⚙️ **Customizable**: Configure your own breakpoint (default: 768px)
- 🔧 **TypeScript**: Full TypeScript support with type definitions
- 🌐 **SSR Ready**: Works with server-side rendering
- ⚡ **Performance**: Efficient event handling with cleanup

## Installation

```bash
npm install light-hooks
```

or

```bash
yarn add light-hooks
```

## Quick Start

```tsx
import React from 'react';
import { 
  isMobile, 
  useClickOutside, 
  useCountdown, 
  useLocalStorage 
} from 'light-hooks';

function MyComponent() {
  // Mobile detection
  const mobile = isMobile();
  
  // Click outside detection
  const modalRef = useClickOutside(() => setIsOpen(false));
  
  // Countdown timer
  const { timeLeft, start, pause, reset } = useCountdown(60);
  
  // Local storage persistence
  const { value, setValue } = useLocalStorage('myData', { count: 0 });
  
  return (
    <div>
      <p>Device: {mobile ? 'Mobile' : 'Desktop'}</p>
      <p>Countdown: {timeLeft}s</p>
      <p>Stored count: {value.count}</p>
      <div ref={modalRef}>Click outside to close</div>
    </div>
  );
}
```

## Documentation

For comprehensive examples, API reference, and advanced usage patterns, visit our [Documentation Site](#).

## API Reference

### `isMobile(options?)`
```tsx
const mobile = isMobile({ breakpoint: 768 });
```

### `useClickOutside(callback, options?)`
```tsx
const ref = useClickOutside(() => console.log('Outside click'));
```

### `useCountdown(options)`
```tsx
const { timeLeft, start, pause, reset } = useCountdown(60);
```

### `useLocalStorage(key, initialValue, options?)`
```tsx
const { value, setValue, removeValue } = useLocalStorage('key', 'default');
```

### `usePing(options)`
```tsx
const { latency, isLive, ping } = usePing('https://api.example.com');
```

### `useHotKey(config, callback, options?)`
```tsx
useHotKey('ctrl+s', () => console.log('Save'));
```

### `useEvent(callback, events, config?)`
```tsx
useEvent((e) => console.log('Click'), 'click', { targetElements: 'button' });
```

## TypeScript Support

All hooks come with full TypeScript definitions:

```tsx
import type { 
  UseLocalStorageReturn,
  UseCountdownOptions,
  HotKeyConfig 
} from 'light-hooks';
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Gourav2609](https://github.com/Gourav2609)

## Repository

[GitHub Repository](https://github.com/Gourav2609/isMobile)