# dkopy 🚀

English | [简体中文](../README.md)

A lightweight, high-performance JavaScript deep clone library with perfect support for complex objects and circular references!

## ✨ Features

- 🚀 **Ultimate Performance** - Optimized cloning algorithm outperforms similar tools
- 🛡️ **Type Safe** - Full TypeScript support with type inference and code hints
- 🔄 **Circular Reference Detection** - Smart handling of circular references
- 🎨 **All Types Support** - Supports all JavaScript data types including `Date`, `RegExp`, `Set`, `Map`, `TypedArray`
- 🧰 **Zero Dependencies** - Pure implementation with no external dependencies
- 📦 **Tiny Size** - Only ~2KB after compression
- 🔒 **Reliable** - Prevents recursive stack overflow with configurable max recursion depth

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

```ts
import dkopy from 'dkopy';

// 1️⃣ Basic deep clone
const cloned = dkopy(source);

// 2️⃣ Handle circular references
const circular = { foo: { bar: {} } };
circular.foo.bar = circular;
const cloned = dkopy(circular); // ✅ Correctly handles circular references
```

## 🎯 Supported Data Types

- 💫 Primitive Types
  - ✅ `String`, `Number`, `Boolean`
  - ✅ `null`, `undefined`
- 📋 Reference Types
  - ✅ `Object`, `Array`
  - ✅ `Date`, `RegExp`
  - ✅ `Map`, `Set`
  - ✅ `TypedArray` (e.g., `Uint8Array`, `Int32Array`, etc.)
  - ✅ `ArrayBuffer`

## 🛠️ API

```ts
function dkopy<T>(input: T, clonedMap?: Map<any, any>): T;
```

* `input`: The value to be cloned
* `clonedMap`: Map for tracking cloned objects (internal use, usually not needed)

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

const cloned = dkopy(complex);
// ✅ All properties are correctly cloned!
```

## ⚡️ Performance Tests

Results using [benchmark.js](https://benchmarkjs.com/) in different scenarios:

```
Deep Clone Performance Test:
✨ dkopy: 681,261 ops/sec ±0.25% (94 runs sampled)
📊 lodash.cloneDeep: 254,535 ops/sec ±0.24% (94 runs sampled)
🚀 rfdc: 745,473 ops/sec ±0.31% (99 runs sampled)
```

## 📈 Performance Advantages

* `dkopy` is 2.68x faster than `lodash.cloneDeep`
* `dkopy` performs close to `rfdc`, only 8.6% difference
* `dkopy` excels in most scenarios, especially with complex objects and circular references

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
