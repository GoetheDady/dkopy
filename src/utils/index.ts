/**
 * 判断给定的值是否为对象类型（非基础数据类型）
 * 
 * @param val - 需要检查的值
 * @returns 如果值不是基础数据类型则返回 true，否则返回 false
 * 
 * @remarks
 * 以下情况将返回 false：
 * - null
 * - undefined
 * - string（字符串）
 * - number（数字）
 * - boolean（布尔值）
 * - symbol Symbol 是一个原始类型，无法通过字面量或构造函数创建。它是唯一的且不可改变的。
 * - bigint BigInt 是原始类型，用于表示任意精度的整数，它可以直接克隆，因为是不可变的
 * 
 * @example
 * ```typescript
 * isObject({}) // true
 * isObject([]) // true
 * isObject(() => {}) // true
 * isObject('string') // false
 * isObject(123) // false
 * isObject(true) // false
 * ```
 */
export function isObject(val: any): boolean {
  return val !== null && typeof val === 'object' || typeof val === 'function';
}


/**
 * 检查给定的值是否为数组
 * 
 * @param val - 需要检查的值
 * @returns 如果参数是数组则返回 true,否则返回 false
 * 
 * @example
 * ```typescript
 * isArray([1, 2, 3]); // true
 * isArray('not array'); // false
 * isArray(null); // false
 * ```
 */
export function isArray(val: any): boolean {
  return Array.isArray(val);
}

/**
 * 检查一个值是否为有效的 Date 对象
 * 
 * @param val - 需要检查的值
 * @returns 如果值是一个有效的 Date 对象返回 true，否则返回 false
 * 
 * @remarks
 * 该函数执行三重检查:
 * 1. 检查值是否为 Date 实例
 * 2. 检查对象的内部类是否为 Date
 * 3. 确保日期值不是 Invalid Date (NaN)
 * 
 * @example
 * ```typescript
 * isDate(new Date()) // true
 * isDate(new Date('invalid')) // false
 * isDate('2023-01-01') // false
 * ```
 */
export function isDate(val: any): val is Date {
  return val instanceof Date && Object.prototype.toString.call(val) === '[object Date]' && !isNaN(val.getTime());
}


/**
 * 检查给定值是否为正则表达式对象
 * 
 * @param val - 要检查的值
 * @returns 如果值是正则表达式对象则返回 true，否则返回 false
 * 
 * @example
 * ```ts
 * isRegExp(/test/); // true
 * isRegExp(new RegExp('test')); // true
 * isRegExp('test'); // false
 * ```
 */
export function isRegExp(val: any): val is RegExp {
  return val instanceof RegExp && Object.prototype.toString.call(val) === '[object RegExp]';
}

/**
 * 检查给定值是否为 Map 对象
 * 
 * @param val - 要检查的值
 * @returns 如果值是 Map 对象则返回 true，否则返回 false。在不支持 Map 的环境中始终返回 false
 * 
 * @example
 * ```ts
 * isMap(new Map()); // true
 * isMap(new WeakMap()); // false
 * ```
 */
export function isMap(val: any): val is Map<any, any> {
  return typeof Map !== 'undefined' &&  val instanceof Map && Object.prototype.toString.call(val) === '[object Map]';
}

/**
 * 检查给定值是否为 Set 对象
 * 
 * @param val - 要检查的值
 * @returns 如果值是 Set 对象则返回 true，否则返回 false。在不支持 Set 的环境中始终返回 false
 * 
 * @example
 * ```ts
 * isSet(new Set()); // true
 * isSet(new WeakSet()); // false
 * ```
 */
export function isSet(val: any): val is Set<any> {
  return typeof Set !== 'undefined' && val instanceof Set && Object.prototype.toString.call(val) === '[object Set]';
}


/**
 * 检查输入值是否为 Buffer 类型
 * 
 * @param val - 要检查的值
 * @returns 如果输入值是 Buffer 类型则返回 true，否则返回 false
 * 
 * @example
 * ```ts
 * isBuffer(Buffer.from('test')); // true
 * isBuffer('test'); // false
 * ```
 */
export function isBuffer(val: any): val is Buffer {
  return typeof Buffer !== 'undefined' && Buffer.isBuffer(val);
}

/**
 * 检查给定的值是否为普通函数
 * 
 * 普通函数是指通过 function 声明或表达式创建的函数，不包括类、箭头函数等其他可调用对象
 * 
 * @param val - 要检查的值
 * @returns 如果值是普通函数则返回 true，否则返回 false
 * 
 * @example
 * ```ts
 * function foo() {}
 * isNormalFunction(foo); // true
 * 
 * const bar = () => {};
 * isNormalFunction(bar); // false
 * 
 * class Baz {}
 * isNormalFunction(Baz); // false
 * ```
 */
export function isNormalFunction(val: any): val is Function {
  return typeof val === 'function' && val.constructor.name === 'Function';
}


/**
 * 检查传入的值是否为箭头函数
 * 通过检查值的类型是否为函数、构造函数名称是否为'Function'以及函数字符串形式是否包含箭头符号'=>'来判断
 * 
 * @param val - 要检查的任意类型值
 * @returns 类型谓词，指示传入值是否为箭头函数
 * 
 * @example
 * ```ts
 * const arrowFn = () => {};
 * isArrowFunction(arrowFn); // returns true
 * 
 * function normalFn() {}
 * isArrowFunction(normalFn); // returns false
 * ```
 */
export function isArrowFunction(val: any): val is Function {
  return typeof val === 'function' && val.constructor.name === 'Function' && val.toString().includes('=>');
}

/**
 * 检查给定的值是否为 DOM 节点
 * 
 * @param val - 要检查的值
 * @returns 如果值是 DOM 节点则返回 true，否则返回 false
 * 
 * @example
 * ```ts
 * isDomNode(document.body); // true
 * isDomNode({}); // false
 * ```
 */
export function isDomNode(val: any): val is HTMLDivElement {
  return typeof HTMLDivElement !== 'undefined' && 
         val instanceof HTMLDivElement && 
         Object.prototype.toString.call(val) === '[object HTMLDivElement]';
}

/**
 * 检查给定值是否为 TypedArray
 * 
 * @param val - 要检查的值
 * @returns 如果值是 TypedArray 则返回 true，否则返回 false
 * 
 * @example
 * ```ts
 * isTypedArray(new Int32Array()); // true
 * isTypedArray(new Float64Array()); // true
 * isTypedArray([]); // false
 * ```
 */
export function isTypedArray(val: any): boolean {
  return ArrayBuffer.isView(val) && !(val instanceof DataView);
}