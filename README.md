# dkopy 🚀

[English](./docs/README_en.md) | 简体中文

一个轻量的 JavaScript 深克隆工具库，可递归复制嵌套值，保留循环引用和重复引用。

## ✨ 特性

- 🚀 **轻量实现** - 对常见类型使用更直接的克隆逻辑。
- 🛡️ **类型安全** - 完整的 TypeScript 支持，提供类型推断和代码提示。
- 🔄 **循环引用检测** - 智能处理循环引用与 `Set`/`Map` 自引用，避免栈溢出。
- 🎨 **内置类型** - 支持 `Date`、`RegExp`、`Set`、`Map` 和二进制数据等常用类型。
- 🧬 **原型保留** - 普通类实例的副本仍可访问原型上的方法。
- 🔑 **Symbol 键** - 对象的可枚举 `Symbol` 属性一并深克隆，`Map` 的键也会克隆。
- 🧰 **零依赖** - 无外部依赖，纯净实现。

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
import { dkopy } from 'dkopy';

// 1️⃣ 基础深克隆
const source = { nested: { value: 42 } };
const cloned = dkopy(source);

// 2️⃣ 处理循环引用
const circular = { foo: { bar: {} } };
circular.foo.bar = circular;
const clonedCircular = dkopy(circular);
console.log(clonedCircular.foo.bar === clonedCircular); // true
```

CommonJS（Node.js 中使用 `require` 加载模块的写法）：`const { dkopy } = require('dkopy');`

## 🎯 支持的数据类型

- 💫 基础类型
  - ✅ `string`、`number`、`boolean`、`bigint`、`symbol`
  - ✅ `null`、`undefined`
- 📋 引用类型
  - ✅ `Object`、`Array`
  - ✅ `Date`、`RegExp`
  - ✅ `Map`（键和值都会克隆）、`Set`（成员都会克隆）
  - ✅ `TypedArray`（如 `Uint8Array`、`Int32Array` 等）、`DataView`
  - ✅ `ArrayBuffer`、`SharedArrayBuffer` 和 Node.js `Buffer`（二进制数据的存储或访问类型；共享同一块内存的视图在克隆后仍共享同一个副本）
  - ✅ 类实例（保留原型链，方法可用）
  - ✅ 对象的可枚举 `Symbol` 键

**范围限制：** 函数、`Promise`、`WeakMap` 和 `Error` 等未支持的值会原样返回。克隆不会重建类的 `#` 私有字段或保留对象属性的完整配置；非常深的嵌套仍可能超出 JavaScript 的递归调用上限。

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

### 发布新版本

更新 `package.json`、`package-lock.json` 的版本号和 `CHANGELOG.md`，提交并推送后，为该提交创建并推送同版本的 Git 标签（例如 `v0.2.1`）。**推送标签就会触发 npm 发布**，不需要创建 GitHub Release。

GitHub Actions 会核对标签和包版本，按锁文件安装依赖并构建，完成类型检查和测试后才发布。npm Trusted Publishing 允许 GitHub Actions 用自身身份换取短期发布凭据；在 npm 的 `dkopy` 设置中授权 `GoetheDady/dkopy` 的 `publish.yml` 即可，无需保存长期凭据。

发布完成后，运行 `npm view dkopy version` 确认 npm 上的版本。

## 📄 许可证

MIT License © 2024-Present

---
⭐️ 如果这个项目对你有帮助，别忘了给它点个星！
