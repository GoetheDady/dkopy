import { dkopyOptions } from './types';
import { 
  isObject, isArray, isDate, isRegExp, 
  isSet, isMap, isBuffer, isTypedArray 
} from './utils';
import { MaxDepthExceededError } from './errors';

/**
 * 深度/浅度克隆任意 JavaScript 数据
 * 
 * @param data - 要克隆的数据
 * @param options - 克隆配置选项
 *   - deep: 是否执行深度克隆
 *   - cache: 用于处理循环引用的 WeakMap
 *   - maxDepth: 最大克隆深度，默认20层
 * @param currentDepth - 当前克隆深度，用于防止无限递归
 * 
 * @throws {MaxDepthExceededError} 当超过最大克隆深度时抛出
 */
function dkopy<T>(
  data: T, 
  options: dkopyOptions = {}, 
  currentDepth: number = 0
): T {
  const { 
    deep: isDeep = false, 
    cache = new WeakMap(),
    maxDepth = 20,
    circularReference = true
  } = options;

  // 快速路径：使用 isObject 进行类型检查
  if (!isObject(data)) return data;

  // 防止递归过深导致栈溢出
  if (currentDepth >= maxDepth) {
    throw new MaxDepthExceededError(currentDepth, maxDepth);
  }

  // 只在启用循环引用检测时才使用缓存
  if (circularReference && cache.has(data)) {
    return cache.get(data);
  }

  let result: any;

  // 优先处理数组类型（最常见的复杂类型之一）
  if (isArray(data)) {
    result = [];
    // 只在启用循环引用检测时才设置缓存
    if (circularReference) {
      cache.set(data, result);
    }
    
    if (isDeep) {
      // 性能优化：使用 for 循环代替 map
      const len = (data as unknown[]).length;
      for (let i = 0; i < len; i++) {
        result[i] = dkopy((data as unknown[])[i], { deep: isDeep, cache, maxDepth }, currentDepth + 1);
      }
    } else {
      // 浅克隆直接复制数组元素
      result.push(...(data as unknown[]));
    }
    return result as T;
  }

  // 处理普通对象（第二常见的复杂类型）
  if (Object.prototype.toString.call(data) === '[object Object]') {
    result = {};
    if (circularReference) {
      cache.set(data, result);
    }
    
    if (isDeep) {
      // 使用 for...in 遍历所有可枚举属性，包括原型链上的
      for (const key in data) {
        // 只克隆对象自身的属性，排除原型链上的属性
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          result[key] = dkopy(
            (data as any)[key],
            { deep: isDeep, cache, maxDepth },
            currentDepth + 1
          );
        }
      }
    } else {
      // 浅克隆直接复制所有属性
      Object.assign(result, data);
    }
    return result as T;
  }

  // 处理特殊内置对象类型
  if (isDate(data)) {
    // Date对象需要创建新实例以隔离引用
    result = isDeep ? new Date((data as Date).getTime()) : data;
  } else if (isRegExp(data)) {
    // RegExp对象克隆需保留原始的source和flags
    result = isDeep ? new RegExp((data as RegExp).source, (data as RegExp).flags) : data;
  } else if (isSet(data)) {
    // Set对象需要克隆其中的每个元素
    const set = data as Set<any>;
    result = isDeep
      ? new Set([...set].map(item => 
          dkopy(item, { deep: isDeep, cache, maxDepth }, currentDepth + 1)))
      : new Set([...set]);
  } else if (isMap(data)) {
    // Map对象需要同时克隆键和值
    const map = data as Map<any, any>;
    result = isDeep
      ? new Map([...map].map(([k, v]) => [
          dkopy(k, { deep: isDeep, cache, maxDepth }, currentDepth + 1),
          dkopy(v, { deep: isDeep, cache, maxDepth }, currentDepth + 1)
        ]))
      : new Map([...map]);
  } else if (isTypedArray(data)) {
    // TypedArray 需要创建相同类型的新实例
    result = isDeep ? new ((data as unknown as { constructor: new (arr: any) => any }).constructor)(data) : data;
  } else if (isBuffer(data)) {
    // Buffer 需要创建新的内存空间
    result = isDeep ? Buffer.from(data as Buffer) : data;
  } else {
    // 其他未知类型对象，直接返回原始值
    result = data;
  }

  // 只在启用循环引用检测时才设置缓存
  if (circularReference) {
    cache.set(data, result);
  }
  return result as T;
}

export default dkopy;