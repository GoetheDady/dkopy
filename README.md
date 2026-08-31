# dkopy 🚀

[English](./docs/README_en.md) | 简体中文

一个超轻量级、高性能的 JavaScript 深克隆工具库，完美支持复杂对象和循环引用的克隆场景！

## ✨ 特性

- 🚀 **极致性能** - 优化的克隆算法，性能远超 `lodash.cloneDeep`。
- 🛡️ **类型安全** - 完整的 TypeScript 支持，提供类型推断和代码提示。
- 🔄 **循环引用检测** - 智能处理循环引用与 `Set`/`Map` 自引用，避免栈溢出。
- 🎨 **全类型支持** - 支持所有 JavaScript 数据类型，包括 `Date`、`RegExp`、`Set`、`Map`、`TypedArray`、`DataView` 等。
- 🧬 **原型保留** - 类实例克隆后保留原型链，方法依然可用。
- 🔑 **Symbol 键** - 对象的可枚举 `Symbol` 属性一并深克隆，`Map` 的键也会克隆。
- 🧰 **零依赖** - 无外部依赖，纯净实现。
- 📦 **体积小巧** - 压缩后仅 ~1KB。

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
  - ✅ `Map`、`Set`（键和值都会克隆）
  - ✅ `TypedArray`（如 `Uint8Array`、`Int32Array` 等）、`DataView`
  - ✅ `ArrayBuffer`
  - ✅ 类实例（保留原型链，方法可用）
  - ✅ 对象的可枚举 `Symbol` 键

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

// 类实例保留原型
class User {
  greet() { return 'hi'; }
}
dkopy(new User()).greet(); // ✅ 方法依然可用
```

## ⚡️ 性能测试

使用 [benchmark.js](https://benchmarkjs.com/) 在复杂对象（含循环引用）场景下的测试结果（`node benchmark/index.js`）：

```
深克隆性能测试:
✨ dkopy: 944,277 ops/sec
📊 lodash.cloneDeep: 380,269 ops/sec
🚀 rfdc: 1,041,425 ops/sec
```

多场景对比（Node 24，rfdc 开启 `circles` 对齐）：

| 场景 | dkopy | lodash.cloneDeep | rfdc |
| --- | --- | --- | --- |
| 原始类型 | ✅ 50.3M ops/sec | 46.3M | 49.8M |
| 小对象（3 键平铺） | 9.4M | 4.3M | ✅ 20.7M |
| 大数组（1 万个数字） | ✅ 23.5k | 3.0k | 9.6k |
| 深嵌套（10 层） | 1.19M | 0.52M | ✅ 3.39M |
| 特殊类型混合 | ✅ 1.52M | 0.36M | 1.44M |
| 复杂对象+循环引用 | 1.25M | 0.36M | ✅ 1.26M |

## 📈 性能优势

* 复杂对象场景下，`dkopy` 的性能是 `lodash.cloneDeep` 的约 2.5 倍。
* `dkopy` 在数组、特殊类型（`Date`/`Map`/`Set`/`TypedArray`）和原始类型场景领先 `rfdc`，复杂对象+循环引用场景已与 `rfdc` 基本持平。
* `dkopy` 附带 `rfdc` 不具备的能力：保留类实例原型、克隆 `Symbol` 键与 `Map` 键。

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
