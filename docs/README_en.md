# dkopy 🚀

English | [简体中文](../README.md)

A lightweight JavaScript library that copies nested values while preserving circular and repeated references.

## ✨ Features

- 🚀 **Lightweight Implementation** - Fast paths for common types
- 🛡️ **Type Safe** - Full TypeScript support with type inference and code hints
- 🔄 **Circular Reference Detection** - Smart handling of circular references
- 🎨 **Built-in Types** - Supports common types such as `Date`, `RegExp`, `Set`, `Map`, and binary data
- 🧰 **Zero Dependencies** - Pure implementation with no external dependencies

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
import { dkopy } from 'dkopy';

// 1️⃣ Basic deep clone
const source = { nested: { value: 42 } };
const cloned = dkopy(source);

// 2️⃣ Handle circular references
const circular = { foo: { bar: {} } };
circular.foo.bar = circular;
const clonedCircular = dkopy(circular);
console.log(clonedCircular.foo.bar === clonedCircular); // true
```

For CommonJS (the Node.js module format that uses `require`): `const { dkopy } = require('dkopy');`

## 🎯 Supported Data Types

- 💫 Primitive Types
  - ✅ `string`, `number`, `boolean`, `bigint`, `symbol`
  - ✅ `null`, `undefined`
- 📋 Reference Types
  - ✅ `Object`, `Array`
  - ✅ `Date`, `RegExp`
  - ✅ `Map` (keys and values), `Set` (members)
  - ✅ `TypedArray` (e.g. `Uint8Array` and `Int32Array`) and `DataView`
  - ✅ `ArrayBuffer`, `SharedArrayBuffer`, and Node.js `Buffer` (views of the same memory continue to share one cloned buffer)
  - ✅ Ordinary class instances (their prototype is retained)

**Property copying:** Plain objects, arrays, and ordinary class instances copy their own enumerable properties (properties that can be listed, keyed by strings or symbols), not inherited ones. Arrays also keep their own indices and leave holes unfilled. An instance's own properties are copied even when the prototype has a read-only property with the same name. Extra properties on built-ins such as `Date` and `Map` are not copied.

**Limits:** Unsupported values such as functions, `Promise`, `WeakMap`, and `Error` are returned unchanged. Cloning does not recreate `#` private fields or preserve full property descriptors (settings such as whether a property is writable). Extremely deep nesting can still exceed JavaScript's call stack limit.

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

Scenario: cloning a complex object with circular references. This measures the current development version. Run `npm run build && npm run benchmark` to reproduce it.

**Test environment (2026-11-26):** Apple M4 (ARM64), macOS 26.6.2, Node.js 24.19.0, Benchmark.js 2.1.4.

| Implementation | Operations per second | Relative margin of error | Samples |
| --- | ---: | ---: | ---: |
| `rfdc` 1.4.1 (`circles: true`) | 1,010,403 | ±0.74% | 95 |
| `dkopy` | 838,699 | ±0.70% | 93 |
| `lodash.cloneDeep` (Lodash 4.18.1) | 358,975 | ±0.30% | 97 |

On this input, `dkopy` completes about 2.34 times as many operations per second as `lodash.cloneDeep` and about 17% fewer than `rfdc`. The timings include creating the test object and initializing `rfdc`. Also, `rfdc` does not preserve the regular expression type on this input, so the results are not an equivalent comparison of cloning alone.

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
