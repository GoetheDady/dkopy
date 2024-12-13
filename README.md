# dkopy 🚀

[English](./docs/README_en.md) | 简体中文

一个超轻量级、性能卓越的 JavaScript 深浅克隆工具库。完美应对复杂对象克隆场景！

## ✨ 特性

- 🚀 极致性能 - 优化的克隆算法
- 🛡️ 类型安全 - 完整的 TypeScript 支持
- 🔄 深浅克隆 - 灵活的克隆策略
- 🎯 循环检测 - 智能处理循环引用
- 🎨 全类型支持 - 支持所有 JavaScript 数据类型
- 🧰 零依赖 - 无外部依赖的纯净实现
- 📦 体积小巧 - 压缩后仅 ~2KB
- 🔒 安全可靠 - 防止递归栈溢出

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
import { deepClone, shallowClone } from 'dkopy';

// 1️⃣ 基础浅克隆
const clone = shallowClone(source);

// 2️⃣ 深度克隆
const deepCloned = deepClone(source);

// 3️⃣ 自定义配置
const safeClone = deepClone(source, { 
  maxDepth: 100  // 设置最大递归深度
});

// 4️⃣ 处理循环引用
const circular = { foo: { bar: {} } };
circular.foo.bar = circular;
const cloned = deepClone(circular); // ✅ 正确处理循环引用
```

## 🎯 支持的数据类型

- 💫 基础类型
  - ✅ String、Number、Boolean
  - ✅ null、undefined
  - ✅ Symbol、BigInt
- 📋 引用类型
  - ✅ Object、Array
  - ✅ Date、RegExp
  - ✅ Map、Set、WeakMap、WeakSet
  - ✅ TypedArray（Int8Array 等）
  - ✅ ArrayBuffer、SharedArrayBuffer
  - ✅ Buffer（Node.js）
  - ✅ 函数引用

## 🛠️ API

```ts
interface CloneOptions {
  maxDepth?: number;   // 最大递归深度，默认 20
  cache?: WeakMap;     // 循环引用缓存
}

deepClone<T>(data: T, options?: CloneOptions): T
shallowClone<T>(data: T): T
```

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

const cloned = deepClone(complex);
// ✅ 所有属性都被正确克隆！
```

## ⚡️ 性能测试

使用 [benchmark.js](https://benchmarkjs.com/) 在不同场景下的测试结果:

```
深克隆性能测试:
✨ dkopy.deepClone-基础类型:   5,562,015 ops/sec
✨ dkopy.deepClone-小型对象:   7,233,195 ops/sec  🏆
✨ dkopy.deepClone-中型对象:     831,033 ops/sec
✨ dkopy.deepClone-深度嵌套:   1,127,315 ops/sec

对比 lodash:
📊 lodash.cloneDeep-基础类型: 2,638,182 ops/sec
📊 lodash.cloneDeep-小型对象: 3,373,687 ops/sec
📊 lodash.cloneDeep-中型对象:    31,078 ops/sec
📊 lodash.cloneDeep-深度嵌套:   384,587 ops/sec
```

## 📈 性能优势

- 🚀 基础类型克隆比 lodash 快 110%
- ⚡️ 小型对象克隆比 lodash 快 114%
- 🎯 中型对象克隆效率提升 2576%
- 💫 深度嵌套对象克隆快 193%
- 🔥 特殊类型克隆性能提升 6326%

## 🎯 高级使用

```ts
// 自定义克隆深度
const cloned = deepClone(data, { maxDepth: 50 });

// 禁用循环引用检测以提升性能
const faster = deepClone(data, { circularReference: false });

// 使用自定义缓存
const cache = new WeakMap();
const clone1 = deepClone(data, { cache });
const clone2 = deepClone(data, { cache }); // 复用缓存
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 🔍 注意事项

- ⚠️ 默认最大递归深度为 20 层
- 💡 建议根据数据结构合理设置 maxDepth
- 🚫 不支持克隆 DOM 节点
- 📝 函数属性会保持引用

## 📄 许可证

MIT License © 2024-Present

---
⭐️ 如果这个项目对你有帮助，别忘了给它点个星！
