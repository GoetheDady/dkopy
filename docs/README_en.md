# dkopy 🚀

[简体中文](../README.md) | English

A lightweight, high-performance JavaScript deep/shallow cloning utility. Perfect for complex object cloning scenarios!

## ✨ Features

- 🚀 Ultimate Performance - Optimized cloning algorithm
- 🛡️ Type Safety - Full TypeScript support
- 🔄 Deep/Shallow Clone - Flexible cloning strategies
- 🎯 Circular Detection - Smart handling of circular references
- 🎨 Full Type Support - Supports all JavaScript data types
- 🧰 Zero Dependencies - Pure implementation
- 📦 Tiny Size - Only ~2KB minified
- 🔒 Reliable - Prevents recursive stack overflow

## 📦 Installation

```bash
# Using npm
npm install dkopy

# Using yarn
yarn add dkopy

# Using pnpm
pnpm add dkopy
```

## 🚀 Quick Start

```js
import { deepClone, shallowClone } from 'dkopy';

// 1️⃣ Basic shallow clone
const clone = shallowClone(source);

// 2️⃣ Deep clone
const deepCloned = deepClone(source);

// 3️⃣ Custom configuration
const safeClone = deepClone(source, { 
  maxDepth: 100  // Set maximum recursion depth
});

// 4️⃣ Handle circular references
const circular = { foo: { bar: {} } };
circular.foo.bar = circular;
const cloned = deepClone(circular); // ✅ Correctly handles circular references
```

## 🎯 Supported Data Types

- 💫 Primitive Types
  - ✅ String, Number, Boolean
  - ✅ null, undefined
  - ✅ Symbol, BigInt
- 📋 Reference Types
  - ✅ Object, Array
  - ✅ Date, RegExp
  - ✅ Map, Set, WeakMap, WeakSet
  - ✅ TypedArray (Int8Array etc.)
  - ✅ ArrayBuffer, SharedArrayBuffer
  - ✅ Buffer (Node.js)
  - ✅ Function references

## 🛠️ API

```ts
interface CloneOptions {
  maxDepth?: number;   // Maximum recursion depth, default 20
  cache?: WeakMap;     // Circular reference cache
}

deepClone<T>(data: T, options?: CloneOptions): T
shallowClone<T>(data: T): T
```

## 🎮 Usage Examples

```ts
// Clone complex objects
const complex = {
  date: new Date(),
  regex: /test/g,
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3]),
  typed: new Int8Array([1, 2, 3]),
  nested: { deep: { deeper: { value: 42 } } }
};

const cloned = deepClone(complex);
// ✅ All properties are correctly cloned!
```

## 🔍 Important Notes

- ⚠️ Default maximum recursion depth is 20 levels
- 💡 Recommend setting appropriate maxDepth based on data structure
- 🚫 DOM nodes cloning not supported
- 📝 Function properties maintain references

## ⚡️ Benchmarks

Results from [benchmark.js](https://benchmarkjs.com/) tests in different scenarios:

```
Deep Clone Performance:
✨ dkopy.deepClone-primitive:   5,562,015 ops/sec
✨ dkopy.deepClone-small:      7,233,195 ops/sec  🏆
✨ dkopy.deepClone-medium:       831,033 ops/sec
✨ dkopy.deepClone-nested:     1,127,315 ops/sec

Compared to lodash:
📊 lodash.cloneDeep-primitive: 2,638,182 ops/sec
📊 lodash.cloneDeep-small:     3,373,687 ops/sec
📊 lodash.cloneDeep-medium:       31,078 ops/sec
📊 lodash.cloneDeep-nested:      384,587 ops/sec
```

## 📈 Performance Benefits

- 🚀 110% faster for primitive types
- ⚡️ 114% faster for small objects
- 🎯 2576% performance boost for medium objects
- 💫 193% faster for deeply nested structures
- 🔥 6326% improvement for special types

## 🎯 Advanced Usage

```ts
// Custom clone depth
const cloned = deepClone(data, { maxDepth: 50 });

// Disable circular reference detection for better performance
const faster = deepClone(data, { circularReference: false });

// Use custom cache
const cache = new WeakMap();
const clone1 = deepClone(data, { cache });
const clone2 = deepClone(data, { cache }); // Reuse cache
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License © 2024-Present

---
⭐️ If this project helps you, don't forget to give it a star!
