# kopy 🚀

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
npm install kopy

# Using yarn
yarn add kopy

# Using pnpm
pnpm add kopy
```

## 🚀 Quick Start

```js
import { deepClone, shallowClone } from 'kopy';

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

## 📄 License

MIT License © 2024-Present

---
⭐️ If this project helps you, don't forget to give it a star!
