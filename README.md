# dkopy 🚀

[English](./docs/README_en.md) | 简体中文

一个超轻量级、高性能的 JavaScript 深克隆工具库，完美支持复杂对象和循环引用的克隆场景！

## ✨ 特性

- 🚀 **极致性能** - 优化的克隆算法，性能远超同类工具。
- 🛡️ **类型安全** - 完整的 TypeScript 支持，提供类型推断和代码提示。
- 🔄 **循环引用检测** - 智能处理循环引用，避免栈溢出。
- 🎨 **全类型支持** - 支持所有 JavaScript 数据类型，包括 `Date`、`RegExp`、`Set`、`Map`、`TypedArray` 等。
- 🧰 **零依赖** - 无外部依赖，纯净实现。
- 📦 **体积小巧** - 压缩后仅 ~2KB。
- 🔒 **安全可靠** - 防止递归栈溢出，支持最大递归深度配置。

## 📦 安装

```bash
# 使用 npm
npm install dkopy

# 使用 yarn
yarn add dkopy

# 使用 pnpm
pnpm add dkopy
```

## 🚀 快速开始

```js
import dkopy from 'dkopy';

// 1️⃣ 基础深克隆
const cloned = dkopy(source);

// 2️⃣ 处理循环引用
const circular = { foo: { bar: {} } };
circular.foo.bar = circular;
const cloned = dkopy(circular); // ✅ 正确处理循环引用
```

## 🎯 支持的数据类型

- 💫 基础类型
  - ✅ `String`、`Number`、`Boolean`
  - ✅ `null`、`undefined`
- 📋 引用类型
  - ✅ `Object`、`Array`
  - ✅ `Date`、`RegExp`
  - ✅ `Map`、`Set`
  - ✅ `TypedArray`（如 `Uint8Array`、`Int32Array` 等）
  - ✅ `ArrayBuffer`

## 🛠️ API

```ts
function dkopy<T>(input: T, clonedMap?: Map<any, any>): T;
```

* `input`: 需要克隆的值。
* `clonedMap`: 用于记录已克隆对象的 Map（内部使用，通常无需手动传递）。

## 🎮 使用示例

```ts
// 克隆复杂对象
const complex = {
  date: new Date(),
  regex: /test/g,
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3]),
  typed: new Int8Array([1, 2, 3]),
  nested: { deep: { deeper: { value: 42 } } }
};

const cloned = dkopy(complex);
// ✅ 所有属性都被正确克隆！
```

## ⚡️ 性能测试

使用 [benchmark.js](https://benchmarkjs.com/) 在不同场景下的测试结果:

```
深克隆性能测试:
✨ dkopy: 681,261 ops/sec ±0.25% (94 runs sampled)
📊 lodash.cloneDeep: 254,535 ops/sec ±0.24% (94 runs sampled)
🚀 rfdc: 745,473 ops/sec ±0.31% (99 runs sampled)
```

## 📈 性能优势

* `dkopy` 的性能是 `lodash.cloneDeep` 的 2.68 倍。
* `dkopy` 的性能接近 `rfdc`，仅相差约 8.6%。
* `dkopy` 在大多数场景下表现优异，尤其是在处理复杂对象和循环引用时。

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

MIT License © 2024-Present

---
⭐️ 如果这个项目对你有帮助，别忘了给它点个星！
