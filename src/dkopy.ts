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
const CONSTRUCTOR_HANDLERS = new Map<string, (input: any, clone: Function) => any>([
  // 处理 Date 类型
  ['[object Date]', (input) => new Date(input.getTime())], // 通过时间戳创建一个新的 Date 对象

  // 处理 RegExp 类型
  ['[object RegExp]', (input) => new RegExp(input.source, input.flags)], // 通过 source 和 flags 创建一个新的 RegExp 对象

  // 处理 Set 类型
  ['[object Set]', (input, clone) => {
    const result = new Set();
    for (const value of input) {
      result.add(clone(value)); // 递归克隆 Set 中的每个元素
    }
    return result;
  }],

  // 处理 Map 类型
  ['[object Map]', (input, clone) => {
    const result = new Map();
    for (const [key, value] of input) {
      result.set(clone(key), clone(value)); // 递归克隆 Map 中的键和值
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
function dkopy<T>(input: T, clonedMap = new Map()): T {
  // 处理基本类型（如 null、undefined、number、string、boolean）
  if (shouldShallowCopy(input)) return input;

  // 如果当前对象已被克隆过，则直接返回克隆后的对象
  // 这是处理循环引用的关键逻辑，避免无限递归
  if (clonedMap.has(input)) return clonedMap.get(input);

  // 获取输入值的类型
  const type = getType(input);

  // 查找特殊类型的处理器
  const handler = CONSTRUCTOR_HANDLERS.get(type);

  // 如果找到对应的处理器，则调用处理器进行克隆
  if (handler) {
    const result = handler(input, (value: any) => dkopy(value, clonedMap)); // 递归调用 dkopy 处理嵌套值
    clonedMap.set(input, result); // 将克隆结果缓存到 Map 中
    return result;
  }

  // 处理数组
  if (type === '[object Array]') {
    const array = input as unknown[];
    const result = new Array(array.length); // 预分配数组空间，避免动态扩容
    clonedMap.set(input, result); // 将克隆结果缓存到 Map 中
    for (let i = 0; i < array.length; i++) {
      result[i] = dkopy(array[i], clonedMap); // 递归克隆数组中的每个元素
    }
    return result as T;
  }

  // 处理 TypedArray（如 Uint8Array、Float32Array 等）
  if (type === '[object Uint8Array]' || type === '[object Uint16Array]' || type === '[object Uint32Array]' ||
      type === '[object Int8Array]' || type === '[object Int16Array]' || type === '[object Int32Array]' ||
      type === '[object Float32Array]' || type === '[object Float64Array]') {
    const typedArray = input as any;
    const result = new typedArray.constructor(
      typedArray.buffer.slice(), // 克隆底层的 ArrayBuffer
      typedArray.byteOffset, // 保持相同的字节偏移
      typedArray.length // 保持相同的长度
    );
    clonedMap.set(input, result); // 将克隆结果缓存到 Map 中
    return result;
  }

  // 处理 ArrayBuffer
  if (type === '[object ArrayBuffer]') {
    const result = (input as ArrayBuffer).slice(0); // 克隆一个新的 ArrayBuffer
    clonedMap.set(input, result); // 将克隆结果缓存到 Map 中
    return result as T;
  }

  // 处理普通对象
  if (type === '[object Object]') {
    const result: any = {};
    clonedMap.set(input, result); // 将克隆结果缓存到 Map 中
    const keys = Object.keys(input as object); // 获取对象的所有可枚举属性
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      result[key] = dkopy((input as Record<string, unknown>)[key], clonedMap); // 递归克隆对象的每个属性
    }
    return result;
  }

  // 默认返回输入值（适用于不支持的类型，如 Symbol、Function 等）
  return input;
}

/**
 * 判断给定的输入值是否应该进行浅拷贝。
 * 浅拷贝适用于基本类型和不可克隆的对象（如 Symbol、Function 等）。
 *
 * @param input - 要检查的值
 * @returns {boolean} 如果满足以下条件之一则返回 true：
 * - 输入值为 null 或 undefined
 * - 输入值为原始类型（如 number、string、boolean）
 * - 输入值是 SHALLOW_COPY_INSTANCES 中定义的类型实例
 */
function shouldShallowCopy(input: any): boolean {
  if (input === null || input === undefined) return true; // null 和 undefined 直接返回
  const type = typeof input;
  if (type !== 'object' && type !== 'function') return true; // 原始类型直接返回
  return false; // 其他类型需要进行深拷贝
}

export default dkopy;
