# dkopy 🚀

[English](./docs/README_en.md) | 简体中文

一个轻量的 JavaScript 深克隆工具库，可递归复制嵌套值，保留循环引用和重复引用。

## ✨ 特性

- 🚀 **轻量实现** - 对常见类型使用更直接的克隆逻辑。
- 🛡️ **类型安全** - 完整的 TypeScript 支持，提供类型推断和代码提示。
- 🔄 **循环引用检测** - 智能处理循环引用与 `Set`/`Map` 自引用，避免栈溢出。
- 🎨 **内置类型** - 支持 `Date`、`RegExp`、`Set`、`Map` 和二进制数据等常用类型。
- 🧬 **原型保留** - 普通类实例的副本仍可访问原型上的方法。
- 🔑 **Symbol 键** - 普通对象、数组和普通类实例自身的可枚举 `Symbol` 属性一并深克隆，`Map` 的键也会克隆。
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

**属性复制规则：** 普通对象、数组和普通类实例都会复制自身可枚举的属性（可以被列出的属性，键可以是字符串或 `Symbol`），不把继承来的属性复制为自有属性。数组还会保留自有索引和空位，空位不会被填成 `undefined`。类实例的副本保留原型，但自己的属性不受原型上同名属性的限制。`Date`、`Map` 等内置对象的额外属性不在此范围内。

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

测试场景：克隆含循环引用的复杂对象。使用当前开发版本，运行 `npm run build && npm run benchmark` 可复测。

**测试环境（2026-11-26）：** Apple M4（ARM64）、macOS 26.6.2、Node.js 24.19.0、Benchmark.js 2.1.4。

| 实现 | 每秒操作数 | 相对误差 | 采样轮次 |
| --- | ---: | ---: | ---: |
| `rfdc` 1.4.1（`circles: true`） | 1,010,403 | ±0.74% | 95 |
| `dkopy` | 838,699 | ±0.70% | 93 |
| `lodash.cloneDeep`（Lodash 4.18.1） | 358,975 | ±0.30% | 97 |

这组输入中，`dkopy` 的每秒操作数约为 `lodash.cloneDeep` 的 2.34 倍，低于 `rfdc` 约 17%。脚本也把创建测试对象和初始化 `rfdc` 的耗时计入结果；`rfdc` 在这组输入中不保留正则表达式类型，因此这不是功能等价的纯克隆对比。

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 发布新版本

推送版本标签会触发 npm 发布；确认新版可安装后，再用同一标签创建 GitHub Release，填写「版本号：一句话摘要」和更新说明。具体命令见 [发版指南](RELEASING.md)，历史改动见 [GitHub Releases](https://github.com/GoetheDady/dkopy/releases)。

## 📄 许可证

MIT License © 2024-Present

---
⭐️ 如果这个项目对你有帮助，别忘了给它点个星！
