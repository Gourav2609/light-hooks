# React Hooks Collection

A collection of useful React hooks starting with `isMobile` - a lightweight hook for detecting mobile devices based on screen width. Perfect for creating responsive components and conditional rendering.

## Hooks Included

### `isMobile`
Detects mobile devices based on screen width with customizable breakpoints.

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

## Usage

### Basic Usage

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

### Custom Breakpoint

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

### Conditional Styling

```tsx
import React from 'react';
import { isMobile } from 'light-hooks';

function Navigation() {
  const mobile = isMobile();

  return (
    <nav style={{
      flexDirection: mobile ? 'column' : 'row',
      padding: mobile ? '10px' : '20px'
    }}>
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </nav>
  );
}
```

### Multiple Breakpoints

```tsx
import React from 'react';
import { isMobile } from 'light-hooks';

function ResponsiveComponent() {
  const mobile = isMobile({ breakpoint: 768 });
  const tablet = isMobile({ breakpoint: 1024 });

  if (mobile) {
    return <div>Mobile Layout</div>;
  }
  
  if (tablet) {
    return <div>Tablet Layout</div>;
  }
  
  return <div>Desktop Layout</div>;
}
```

## API Reference

### `isMobile(options?)`

#### Parameters

- `options` (optional): Configuration object
  - `breakpoint` (optional): Number - The pixel width below which the device is considered mobile. Default: `768`

#### Returns

- `boolean`: `true` if the current screen width is below the breakpoint, `false` otherwise

#### Types

```typescript
interface IsMobileOptions {
  breakpoint?: number;
}

declare const isMobile: (options?: IsMobileOptions) => boolean;
```

## Common Breakpoints

Here are some common breakpoints you might want to use:

- **320px**: Small mobile devices
- **480px**: Mobile devices
- **640px**: Small tablets
- **768px**: Tablets (default)
- **1024px**: Small laptops
- **1280px**: Laptops/Desktops

## Server-Side Rendering (SSR)

The hook is SSR-friendly and will return `false` during server-side rendering to prevent hydration mismatches. The correct value will be set on the client after hydration.

## Browser Support

This hook works in all modern browsers that support:
- ES2015+
- React 16.8+ (hooks)
- `window.addEventListener`
- `window.innerWidth`

## Roadmap

More hooks are coming soon! Planned additions include:
- `useLocalStorage` - Local storage management
- `useDebounce` - Debounced values
- `useClickOutside` - Detect clicks outside elements
- `useWindowSize` - Window dimensions tracking
- `useMediaQuery` - CSS media query matching

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Gourav2609](https://github.com/Gourav2609)

## Repository

[GitHub Repository](https://github.com/Gourav2609/isMobile)