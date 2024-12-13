import dkopy from '../dkopy';

/**
 * 浅拷贝一个 Error 对象
 * 
 * @param data - 要拷贝的原始 Error 对象
 * @returns 返回一个新的 Error 对象，包含原始对象的名称、消息、堆栈信息和其他自定义属性
 * 
 * @remarks
 * 该函数会创建一个新的 Error 实例，并：
 * - 复制原始错误的 message、name 和 stack 属性
 * - 复制原始错误对象上的所有自定义属性（不包括 name、message、stack）
 * 
 * @example
 * ```typescript
 * const originalError = new Error('测试错误');
 * originalError.customField = '自定义数据';
 * const clonedError = shallowCloneErrorObject(originalError);
 * ```
 */
export function shallowCloneErrorObject(data: Error): Error {
  const clone = new Error(data.message);
  clone.name = data.name;
  clone.stack = data.stack;

  Object.getOwnPropertyNames(data).forEach(key => {
    if (!['name', 'message', 'stack'].includes(key)) {
      (clone as any)[key] = (data as any)[key];
    }
  })

  return clone
}

/**
 * 深度克隆 Error 对象
 * 
 * 此函数创建一个 Error 对象的深度副本，包括其所有属性。
 * 基本属性（name、message、stack）会直接复制，
 * 其他自定义属性会通过 dkopy 函数进行深度克隆。
 * 
 * @param data - 要克隆的原始 Error 对象
 * @returns 克隆后的新 Error 对象
 * 
 * @example
 * ```ts
 * const originalError = new Error('测试错误');
 * originalError.customProp = { foo: 'bar' };
 * const clonedError = deepCloneErrorObject(originalError);
 * ```
 */
export function deepCloneErrorObject(data: Error): Error {
  const clone = new Error(data.message);
  clone.name = data.name;
  clone.stack = data.stack;

  Object.getOwnPropertyNames(data).forEach(key => {
    if (!['name', 'message', 'stack'].includes(key)) {
      (clone as any)[key] = dkopy((data as any)[key], { deep: true });
    }
  });

  return clone;
}

/**
 * 深度克隆一个 Promise 对象及其解决值或拒绝原因
 * 
 * @template T - Promise 解决值的类型
 * @param promise - 要克隆的原始 Promise 对象
 * @returns 一个新的 Promise，其解决值或拒绝原因是原始 Promise 的深度克隆
 *
 * @example
 * ```typescript
 * const originalPromise = Promise.resolve({ data: [1, 2, 3] });
 * const clonedPromise = deepClonePromise(originalPromise);
 * ```
 * 
 * @remarks
 * - 使用 dkopy 函数执行深度克隆
 * - 克隆包括 Promise 的解决值和拒绝原因
 * - 返回的是一个新的 Promise 实例
 */
export function deepClonePromise<T>(promise: Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    promise.then(
      value => resolve(dkopy(value, { deep: true })),
      error => reject(dkopy(error, { deep: true }))
    );
  });
}