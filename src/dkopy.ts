/**
 * 获取值的类型字符串。
 * 使用 `Object.prototype.toString.call` 来精确检测对象类型。
 * 这种方法比 `typeof` 和 `instanceof` 更可靠，能够准确区分 `null`、`Array`、`Date` 等类型。
 *
 * @param value - 要检测的值
 * @returns {string} 类型字符串，例如 '[object Date]'
 */
function getType(value: any): string {
  return Object.prototype.toString.call(value);
}

/**
 * 特殊类型的处理器。
 * 使用 Map 存储不同类型（如 Date、RegExp、Set、Map）的克隆逻辑。
 * 每种类型对应一个处理函数，确保克隆后的对象与原对象行为一致。
 */
const CONSTRUCTOR_HANDLERS = new Map<string, (input: any, clone: Function, map: Map<any, any>) => any>([
  // 处理 Date 类型
  ['[object Date]', (input) => new Date(input.getTime())], // 通过时间戳创建一个新的 Date 对象

  // 处理 RegExp 类型
  ['[object RegExp]', (input) => new RegExp(input.source, input.flags)], // 通过 source 和 flags 创建一个新的 RegExp 对象

  // 处理 Set 类型：先注册克隆结果再递归填充，保证自引用（如 set.add(set)）安全
  ['[object Set]', (input, clone, map) => {
    const result = new Set();
    map.set(input, result);
    for (const value of input) {
      result.add(clone(value)); // 递归克隆 Set 中的每个元素
    }
    return result;
  }],

  // 处理 Map 类型：键和值都递归克隆；先注册克隆结果再递归填充，保证自引用安全
  ['[object Map]', (input, clone, map) => {
    const result = new Map();
    map.set(input, result);
    for (const [key, value] of input) {
      result.set(clone(key), clone(value)); // 递归克隆 Map 中的每个键值
    }
    return result;
  }],
]);

/**
 * 深克隆函数。
 * 支持循环引用检测。
 *
 * @param input - 要克隆的值
 * @param clonedMap - 用于记录已克隆对象的 Map（内部使用）
 * @returns {T} 克隆后的值
 */
function dkopy<T>(input: T, clonedMap?: Map<any, any>): T {
  // 处理基本类型（如 null、undefined、number、string、boolean）及函数
  if (input == null || (typeof input !== 'object' && typeof input !== 'function')) return input;

  // 仅在遇到对象时才创建克隆缓存（原始类型零分配）
  const map = clonedMap ?? new Map();

  // 如果当前对象已被克隆过，则直接返回克隆后的对象
  // 这是处理循环引用的关键逻辑，避免无限递归
  if (map.has(input)) return map.get(input);

  // 快路径：数组是最常见类型之一，先用原生检测，免去 toString 派发
  if (Array.isArray(input)) {
    const result = new Array(input.length); // 预分配数组空间，避免动态扩容
    map.set(input, result);
    for (let i = 0; i < input.length; i++) {
      result[i] = dkopy(input[i], map); // 递归克隆数组中的每个元素
    }
    return result as T;
  }

  // 处理 TypedArray 与 DataView（ArrayBuffer.isView 覆盖所有视图类型）
  if (ArrayBuffer.isView(input)) {
    const view = input as any;
    const result = new view.constructor(
      view.buffer.slice(), // 克隆底层的 ArrayBuffer
      view.byteOffset, // 保持相同的字节偏移
      view.length // 保持相同的长度
    );
    map.set(input, result);
    return result;
  }

  // 快路径：普通对象（最常见类型），原型判断替代 toString 派发
  const proto = Object.getPrototypeOf(input);
  if (proto === Object.prototype || proto === null) {
    const result: any = {};
    map.set(input, result);
    copyOwnProps(input, result, map);
    return result;
  }

  // 获取输入值的类型
  const type = getType(input);

  // 特殊类型（Date、RegExp、Set、Map）派发给处理器
  const handler = CONSTRUCTOR_HANDLERS.get(type);
  if (handler) {
    return handler(input, (value: any) => dkopy(value, map), map);
  }

  // 处理 ArrayBuffer
  if (type === '[object ArrayBuffer]') {
    const result = (input as unknown as ArrayBuffer).slice(0); // 克隆一个新的 ArrayBuffer
    map.set(input, result);
    return result as T;
  }

  // 处理类实例等保留原型的对象（Object.create 保留原型链）
  if (type === '[object Object]') {
    const result: any = Object.create(proto);
    map.set(input, result);
    copyOwnProps(input, result, map);
    return result;
  }

  // 默认返回输入值（适用于不支持的类型，如 Promise、WeakMap、Function 等）
  return input;
}

/**
 * 复制对象自身的可枚举属性（字符串键 + 可枚举 Symbol 键），值递归克隆。
 */
function copyOwnProps(src: any, result: any, map: Map<any, any>): void {
  for (const key of Object.keys(src)) {
    result[key] = dkopy(src[key], map); // 递归克隆字符串键属性
  }
  for (const sym of Object.getOwnPropertySymbols(src)) {
    if (Object.prototype.propertyIsEnumerable.call(src, sym)) {
      result[sym] = dkopy(src[sym], map); // 递归克隆可枚举 Symbol 键属性
    }
  }
}

export default dkopy;
