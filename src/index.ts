import dkopy from './dkopy';
import type { dkopyOptions } from './types';

/**
 * 对数据进行深度克隆
 * @param data 要克隆的数据
 * @param options 克隆配置选项
 */
export function deepClone<T>(data: T, options: Omit<dkopyOptions, 'deep'> = {}): T {
  return dkopy(data, { ...options, deep: true });
}

/**
 * 对数据进行浅克隆
 * @param data 要克隆的数据
 */
export function shallowClone<T>(data: T): T {
  return dkopy(data, { deep: false });
}

export type { dkopyOptions };