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
 * 深克隆支持的对象类型，保留循环引用以及对同一对象的重复引用。
 * 原始值和未支持的类型（如函数、Promise）直接返回。
 * 复制数组元素时，数字、字符串等值可以直接写入，无需递归。
 *
 * @param input - 要克隆的值
 * @param clonedMap - 用于记录已克隆对象的 Map（内部使用）
 * @returns {T} 克隆后的值
 */
export function dkopy<T>(input: T, clonedMap?: Map<any, any>): T {
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
    for (let index = 0; index < input.length; index++) {
      if (Object.prototype.hasOwnProperty.call(input, index)) {
        const value = input[index];
        const type = typeof value;
        result[index] = type === 'object' || type === 'function'
          ? dkopy(value, map)
          : value;
      }
    }
    copyOwnProps(input, result, map, true);
    return result as T;
  }

  // 处理 TypedArray 与 DataView（ArrayBuffer.isView 覆盖所有视图类型）
  if (ArrayBuffer.isView(input)) {
    const view = input as any;
    const buffer = dkopy(view.buffer, map);
    const result = typeof Buffer !== 'undefined' && Buffer.isBuffer(view)
      ? Buffer.from(buffer, view.byteOffset, view.length)
      : new view.constructor(buffer, view.byteOffset, view.length ?? view.byteLength);
    map.set(input, result);
    return result;
  }

  // 快路径：普通对象（最常见类型），原型判断替代 toString 派发
  const proto = Object.getPrototypeOf(input);
  if (proto === Object.prototype || proto === null) {
    const result = proto === null ? Object.create(null) : {};
    map.set(input, result);
    copyOwnProps(input, result, map);
    return result;
  }

  const value: unknown = input;
  switch (getType(value)) {
    case '[object Date]': {
      const result = new Date((value as Date).getTime());
      map.set(input, result);
      return result as T;
    }
    case '[object RegExp]': {
      const regexp = value as RegExp;
      const result = new RegExp(regexp.source, regexp.flags);
      result.lastIndex = regexp.lastIndex;
      map.set(input, result);
      return result as T;
    }
    // 容器必须先登记副本，再填充内容，才能正确处理自引用。
    case '[object Set]': {
      const result = new Set();
      map.set(input, result);
      for (const member of value as Set<unknown>) {
        result.add(dkopy(member, map));
      }
      return result as T;
    }
    case '[object Map]': {
      const result = new Map();
      map.set(input, result);
      for (const [key, entry] of value as Map<unknown, unknown>) {
        result.set(dkopy(key, map), dkopy(entry, map));
      }
      return result as T;
    }
    case '[object ArrayBuffer]':
    case '[object SharedArrayBuffer]': {
      const result = (value as ArrayBuffer | SharedArrayBuffer).slice(0);
      map.set(input, result);
      return result as T;
    }
    case '[object Object]': {
      const result = Object.create(proto);
      map.set(input, result);
      copyOwnProps(input, result, map, true);
      return result;
    }
    default:
      // 未支持的类型（如 Promise、WeakMap、Function）沿用原值。
      return input;
  }
}

/**
 * 复制源对象自身的可枚举字符串键和 Symbol 键，并递归克隆属性值。
 * 数组索引由调用方先复制，此处只补充额外属性。
 *
 * @param src - 要读取属性的源对象
 * @param result - 接收克隆属性的目标对象
 * @param map - 记录已克隆对象的映射，用于复用克隆结果
 * @param defineOwn - 是否直接建立目标的自有属性，避免触发继承的同名属性
 * @returns 无返回值，直接修改目标对象
 */
function copyOwnProps(src: any, result: any, map: Map<any, any>, defineOwn = false): void {
  const arrayIndicesCopied = defineOwn && Array.isArray(result);
  for (const key of Object.keys(src)) {
    if (arrayIndicesCopied && Object.prototype.hasOwnProperty.call(result, key)) continue;
    copyOwnProp(src, result, key, map, defineOwn);
  }
  for (const key of Object.getOwnPropertySymbols(src)) {
    if (Object.prototype.propertyIsEnumerable.call(src, key)) {
      copyOwnProp(src, result, key, map, defineOwn);
    }
  }
}

/**
 * 克隆一个属性值并写入副本，必要时直接定义属性以绕过原型上的同名属性。
 * 名为 `__proto__` 的属性始终作为普通数据写入。
 *
 * @param src - 提供属性值的源对象
 * @param result - 接收属性的副本
 * @param key - 要复制的字符串键或 Symbol 键
 * @param map - 保留对象间引用关系的克隆映射
 * @param defineOwn - 是否绕过普通赋值，直接定义自有属性
 * @returns 无返回值，直接修改副本
 */
function copyOwnProp(src: any, result: any, key: string | symbol, map: Map<any, any>, defineOwn: boolean): void {
  const value = dkopy(src[key], map);
  if (defineOwn || key === '__proto__') {
    Object.defineProperty(result, key, { value, enumerable: true, writable: true, configurable: true });
  } else {
    result[key] = value;
  }
}
