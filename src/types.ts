export interface dkopyOptions {
  deep?: boolean;
  cache?: WeakMap<any, any>;
  maxDepth?: number; // 添加最大遍历深度选项
}

export type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array;
