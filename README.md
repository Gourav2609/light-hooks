# light-hooks

A lightweight React hooks library built for performance and developer experience.

[![npm version](https://img.shields.io/npm/v/light-hooks.svg)](https://www.npmjs.com/package/light-hooks)
[![npm downloads](https://img.shields.io/npm/dm/light-hooks.svg)](https://www.npmjs.com/package/light-hooks)
[![bundle size](https://img.shields.io/bundlephobia/minzip/light-hooks)](https://bundlephobia.com/package/light-hooks)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

```bash
npm install light-hooks
```

Built by [Gourav2609](https://github.com/Gourav2609) with focus on performance and simplicity.

## ✨ Why light-hooks?

**light-hooks** delivers production-ready React hooks that prioritize performance without sacrificing developer experience. Each hook is carefully optimized using modern browser APIs and best practices.

- **🪶 Ultra-lightweight** — Tree-shakable with minimal runtime overhead
- **⚡ Performance-first** — Uses ResizeObserver, stable refs, and optimized event handling  
- **🎯 TypeScript native** — Written in TypeScript with complete type safety
- **🔧 SSR compatible** — Zero hydration mismatches, works everywhere
- **🎨 Developer friendly** — Intuitive APIs with comprehensive documentation

## Quick Start

```tsx
import { useLocalStorage, useIsMobile } from 'light-hooks'

export default function App() {
  const [count, setCount] = useLocalStorage('counter', 0)
  const isMobile = useIsMobile()

  return (
    <div>
      <h1>{isMobile ? '📱' : '💻'} Counter: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}
```

## 🎣 Hooks

**`useIsMobile`** — Mobile device detection with ResizeObserver for zero-cost updates.

**`useClickOutside`** — Handle clicks outside elements. Perfect for modals and dropdowns.

**`useCountdown`** — Flexible countdown timers with start/pause/reset controls.

**`useLocalStorage`** — Persistent state with automatic serialization and cross-tab sync.

**`usePing`** — Network connectivity monitoring with real-time latency measurement.

**`useHotKey`** — Keyboard shortcuts with modifier keys and conflict-free bindings.

**`useEvent`** — Advanced event handling with delegation and performance optimization.

## 📚 Learn More

Visit [lighthooks.com](https://www.lighthooks.com/) for detailed documentation, examples, and API references.

## 🛠️ Contributing

We welcome contributions! Check out our [contributing guide](https://github.com/Gourav2609/light-hooks/blob/main/CONTRIBUTING.md) to get started.

## 👥 Contributors

Thanks to these amazing people who have contributed to light-hooks:

<table>
<tr>
<td align="center">
<a href="https://github.com/div02-afk">
<img src="https://github.com/div02-afk.png" width="100px;" alt="div02-afk"/>
<br />
<sub><b>div02-afk</b></sub>
</a>
<br />
<sub>New hooks implementation</sub>
</td>
</tr>
</table>

## 📝 License

MIT © [Gourav2609](https://github.com/Gourav2609)