import dkopy from '../src/dkopy';

describe('深克隆测试', () => {
  test('基础类型测试', () => {
    const testCases = [
      { value: 123, desc: '数字' },
      { value: 0, desc: '零' },
      { value: -1, desc: '负数' },
      { value: Number.MAX_SAFE_INTEGER, desc: '最大安全整数' },
      { value: Number.MIN_SAFE_INTEGER, desc: '最小安全整数' },
      { value: Infinity, desc: '无穷大' },
      { value: -Infinity, desc: '负无穷' },
      { value: NaN, desc: 'NaN' },
      { value: 'hello', desc: '字符串' },
      { value: '', desc: '空字符串' },
      { value: true, desc: 'true布尔值' },
      { value: false, desc: 'false布尔值' },
      { value: null, desc: 'null' },
      { value: undefined, desc: 'undefined' },
      { value: Symbol('test'), desc: 'Symbol' },
      { value: BigInt(9007199254740991), desc: 'BigInt' }
    ];
  
    testCases.forEach(({ value, desc }) => {
      if (typeof value === 'symbol') {
        expect(dkopy(value).toString()).toBe(value.toString());
      } else {
        expect(dkopy(value)).toBe(value);
      }
    });
  });

  test('普通对象测试', () => {
    const obj = {
      number: 123,
      string: 'hello',
      boolean: true,
      nullValue: null,
      undefinedValue: undefined,
      nested: {
        a: 1,
        b: {
          c: 2,
          d: [1, 2, 3]
        }
      },
      array: [1, { x: 1 }, [2, 3]]
    };
  
    const cloned = dkopy(obj);
  
    // 测试基本结构相等
    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
  
    // 测试嵌套对象独立性
    expect(cloned.nested).not.toBe(obj.nested);
    expect(cloned.nested.b).not.toBe(obj.nested.b);
    expect(cloned.array[1]).not.toBe(obj.array[1]);
  
    // 测试修改克隆对象不影响原对象
    cloned.nested.b.c = 999;
    expect(obj.nested.b.c).toBe(2);
  
    // 测试空对象
    expect(dkopy({})).toEqual({});
  });
  

  test('数组测试', () => {
    const arr = [1, { a: 2 }, [3, 4]];
    const cloned = dkopy(arr);
  
    // 测试基本结构相等
    expect(cloned).toEqual(arr);
    expect(cloned).not.toBe(arr);
  
    // 测试嵌套对象独立性
    expect(cloned[1]).not.toBe(arr[1]);
    expect(cloned[2]).not.toBe(arr[2]);
  
    // 测试修改克隆对象不影响原对象
    (cloned[1] as { a: number }).a = 999;
    expect(arr[1]).toEqual({ a: 2 });
  
    // 测试空数组
    expect(dkopy([])).toEqual([]);
  });
  

  test('Date 对象测试', () => {
    const date = new Date();
    const cloned = dkopy(date);
  
    // 测试克隆后的 Date 对象与原对象值相等
    expect(cloned).toEqual(date);
    expect(cloned).not.toBe(date);
  
    // 测试时间戳是否一致
    expect(cloned.getTime()).toBe(date.getTime());
  
    // 测试修改克隆对象不影响原对象
    cloned.setFullYear(2050);
    expect(date.getFullYear()).not.toBe(2050);
  
    // 测试无效日期
    const invalidDate = new Date('invalid');
    const clonedInvalidDate = dkopy(invalidDate);
    expect(clonedInvalidDate.toString()).toBe(invalidDate.toString());
  });
  

  test('RegExp 对象测试', () => {
    const regexp = /test/gi;
    const cloned = dkopy(regexp);
  
    // 测试克隆后的 RegExp 对象与原对象值相等
    expect(cloned).toEqual(regexp);
    expect(cloned).not.toBe(regexp);
  
    // 测试 source 和 flags 是否一致
    expect(cloned.source).toBe(regexp.source);
    expect(cloned.flags).toBe(regexp.flags);
  
    // 测试正则表达式的功能是否一致
    const testString = 'test TEST tEsT';
    expect(testString.match(cloned)).toEqual(testString.match(regexp));
  
    // 测试空正则表达式
    const emptyRegexp = new RegExp('');
    const clonedEmptyRegexp = dkopy(emptyRegexp);
    expect(clonedEmptyRegexp).toEqual(emptyRegexp);
    expect(clonedEmptyRegexp).not.toBe(emptyRegexp);
  });
  

  test('Map 测试', () => {
    const map = new Map<any, any>([
      ['key1', 'value1'], // 字符串键和值
      [123, { a: 1 }],    // 数字键和对象值
      [true, false],      // 布尔键和布尔值
      [null, undefined],  // null 键和 undefined 值
      [{ key: 'nested' }, [1, 2, 3]], // 对象键和数组值
      [Symbol('test'), new Date()],   // Symbol 键和 Date 值
      [new Map(), new Set()]          // Map 键和 Set 值
    ]);

    const cloned = dkopy(map);

    // 测试克隆后的 Map 对象与原对象值相等
    expect(cloned).toEqual(map);
    expect(cloned).not.toBe(map);

    // 测试嵌套对象的独立性
    map.forEach((value, key) => {
      // 确保克隆后的 Map 包含相同的键值对
      expect(cloned.has(key)).toBe(true);
      expect(cloned.get(key)).toEqual(value);

      // 如果值是对象，确保克隆后的值与原值不是同一个引用
      if (typeof value === 'object' && value !== null) {
        expect(cloned.get(key)).not.toBe(value);
      }
    });

    // 测试修改克隆对象不影响原对象
    const nestedObjectKey = Array.from(cloned.keys()).find(key => typeof key === 'object' && key !== null);
    if (nestedObjectKey) {
      (cloned.get(nestedObjectKey) as any).push(4); // 修改克隆对象的数组值
      expect(map.get(nestedObjectKey)).toEqual([1, 2, 3]); // 原对象不受影响
    }

    // 测试空 Map
    const emptyMap = new Map();
    const clonedEmptyMap = dkopy(emptyMap);
    expect(clonedEmptyMap).toEqual(emptyMap);
    expect(clonedEmptyMap).not.toBe(emptyMap);

    // 测试 Map 的键值对数量是否一致
    expect(cloned.size).toBe(map.size);
  });

  

  test('Set 测试', () => {
    const set = new Set<any>([
      1,                  // 数字
      { a: 2 },           // 对象
      [3, 4],             // 数组
      'hello',            // 字符串
      true,               // 布尔值
      null,               // null
      undefined,          // undefined
      Symbol('test'),     // Symbol
      new Date(),         // Date
      new Map(),          // Map
      new Set()           // Set
    ]);
  
    const cloned = dkopy(set);
  
    // 测试克隆后的 Set 对象与原对象值相等
    expect(cloned).toEqual(set);
    expect(cloned).not.toBe(set);
  
    // 测试嵌套对象的独立性
    set.forEach(value => {
      if (typeof value === 'object' && value !== null) {
        expect(cloned.has(value)).toBe(false); // 确保嵌套对象是独立的
        expect(Array.from(cloned).find(clonedValue => clonedValue === value)).toBeUndefined();
      } else {
        expect(cloned.has(value)).toBe(true); // 基础类型值应该一致
      }
    });
  
    // 测试修改克隆对象不影响原对象
    const nestedObject = Array.from(cloned).find(value => Array.isArray(value));
    if (nestedObject) {
      (nestedObject as any).push(5); // 修改克隆对象的数组值
      expect(Array.from(set).find(value => Array.isArray(value))).toEqual([3, 4]); // 原对象不受影响
    }
  
    // 测试空 Set
    const emptySet = new Set();
    const clonedEmptySet = dkopy(emptySet);
    expect(clonedEmptySet).toEqual(emptySet);
    expect(clonedEmptySet).not.toBe(emptySet);
  
    // 测试 Set 的大小是否一致
    expect(cloned.size).toBe(set.size);
  });
  

  test('Buffer 测试', () => {
    const buffer = Buffer.from('hello'); // 使用 Buffer.from 创建 Buffer
    const cloned = dkopy(buffer);
  
    // 测试克隆后的 Buffer 对象与原对象值相等
    expect(cloned).toEqual(buffer);
    expect(cloned).not.toBe(buffer);
  
    // 测试 Buffer 的内容是否一致
    expect(cloned.toString()).toBe(buffer.toString());
  
    // 测试修改克隆对象不影响原对象
    cloned.write('world', 0);
    expect(buffer.toString()).toBe('hello'); // 原对象不受影响
    expect(cloned.toString()).toBe('world'); // 克隆对象已修改
  
    // 测试空 Buffer
    const emptyBuffer = Buffer.alloc(0); // 使用 Buffer.alloc 创建空 Buffer
    const clonedEmptyBuffer = dkopy(emptyBuffer);
    expect(clonedEmptyBuffer).toEqual(emptyBuffer);
    expect(clonedEmptyBuffer).not.toBe(emptyBuffer);
  
    // 测试 Buffer 的长度是否一致
    expect(cloned.length).toBe(buffer.length);
  });

  test('TypedArray 测试', () => {
    const typedArray = new Int32Array([1, 2, 3, 4, 5]); // 使用 Int32Array 作为测试用例
    const cloned = dkopy(typedArray);
  
    // 测试克隆后的 TypedArray 对象与原对象值相等
    expect(cloned).toEqual(typedArray);
    expect(cloned).not.toBe(typedArray);
  
    // 测试 TypedArray 的内容是否一致
    expect(cloned.buffer).not.toBe(typedArray.buffer); // 确保底层 ArrayBuffer 是独立的
    expect([...cloned]).toEqual([...typedArray]); // 测试内容是否一致
  
    // 测试修改克隆对象不影响原对象
    cloned[0] = 999;
    expect(typedArray[0]).toBe(1); // 原对象不受影响
    expect(cloned[0]).toBe(999); // 克隆对象已修改
  
    // 测试空 TypedArray
    const emptyTypedArray = new Int32Array(0); // 空 TypedArray
    const clonedEmptyTypedArray = dkopy(emptyTypedArray);
    expect(clonedEmptyTypedArray).toEqual(emptyTypedArray);
    expect(clonedEmptyTypedArray).not.toBe(emptyTypedArray);
  
    // 测试 TypedArray 的长度是否一致
    expect(cloned.length).toBe(typedArray.length);
  
    // 测试其他 TypedArray 类型
    const uint8Array = new Uint8Array([1, 2, 3]);
    const clonedUint8Array = dkopy(uint8Array);
    expect(clonedUint8Array).toEqual(uint8Array);
    expect(clonedUint8Array).not.toBe(uint8Array);
  
    const float32Array = new Float32Array([1.1, 2.2, 3.3]);
    const clonedFloat32Array = dkopy(float32Array);
    expect(clonedFloat32Array).toEqual(float32Array);
    expect(clonedFloat32Array).not.toBe(float32Array);
  });
  

  test('ArrayBuffer 测试', () => {
    const arrayBuffer = new ArrayBuffer(16); // 创建一个 16 字节的 ArrayBuffer
    const uint8Array = new Uint8Array(arrayBuffer);
    uint8Array.set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]); // 填充数据
  
    const cloned = dkopy(arrayBuffer);
  
    // 测试克隆后的 ArrayBuffer 对象与原对象值相等
    expect(cloned).toEqual(arrayBuffer);
    expect(cloned).not.toBe(arrayBuffer);
  
    // 测试 ArrayBuffer 的内容是否一致
    const clonedUint8Array = new Uint8Array(cloned);
    expect(clonedUint8Array).toEqual(uint8Array);
  
    // 测试修改克隆对象不影响原对象
    clonedUint8Array[0] = 255;
    expect(uint8Array[0]).toBe(1); // 原对象不受影响
    expect(clonedUint8Array[0]).toBe(255); // 克隆对象已修改
  
    // 测试空 ArrayBuffer
    const emptyArrayBuffer = new ArrayBuffer(0); // 空 ArrayBuffer
    const clonedEmptyArrayBuffer = dkopy(emptyArrayBuffer);
    expect(clonedEmptyArrayBuffer).toEqual(emptyArrayBuffer);
    expect(clonedEmptyArrayBuffer).not.toBe(emptyArrayBuffer);
  
    // 测试 ArrayBuffer 的字节长度是否一致
    expect(cloned.byteLength).toBe(arrayBuffer.byteLength);
  });
  

  // test('DataView 测试', () => {
  //   const buffer = new ArrayBuffer(8);
  //   const dataView = new DataView(buffer);
  //   dataView.setInt16(0, 256);
  //   const cloned = dkopy(dataView);
  //   expect(cloned).toEqual(dataView);
  //   expect(cloned).not.toBe(dataView);
  //   expect(cloned.getInt16(0)).toBe(dataView.getInt16(0));
  // });

  // test('Error 对象测试', () => {
  //   const error = new Error('test error');
  //   error.name = 'CustomError';
  //   const cloned = dkopy(error);
  //   expect(cloned).toEqual(error);
  //   expect(cloned).not.toBe(error);
  //   expect(cloned.message).toBe(error.message);
  //   expect(cloned.name).toBe(error.name);
  // });

  test('循环引用测试', () => {
    const obj: any = { a: 1 };
    obj.self = obj; // 创建循环引用
  
    const cloned = dkopy(obj);
  
    // 测试克隆后的对象与原对象值相等
    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
  
    // 测试循环引用关系是否保持
    expect(cloned.self).toBe(cloned); // 克隆对象的 self 应该指向自身
  
    // 测试修改克隆对象不影响原对象
    cloned.a = 2;
    expect(obj.a).toBe(1); // 原对象不受影响
    expect(cloned.a).toBe(2); // 克隆对象已修改
  
    // 测试嵌套循环引用
    const nestedObj: any = { b: 1 };
    nestedObj.child = { parent: nestedObj }; // 嵌套循环引用
    const clonedNestedObj = dkopy(nestedObj);
  
    expect(clonedNestedObj).toEqual(nestedObj);
    expect(clonedNestedObj).not.toBe(nestedObj);
    expect(clonedNestedObj.child.parent).toBe(clonedNestedObj); // 嵌套循环引用关系保持
  
    // 测试数组中的循环引用
    const arr: any[] = [1, 2, 3];
    arr.push(arr); // 数组中的循环引用
    const clonedArr = dkopy(arr);
  
    expect(clonedArr).toEqual(arr);
    expect(clonedArr).not.toBe(arr);
    expect(clonedArr[3]).toBe(clonedArr); // 数组中的循环引用关系保持
  });
  

  // test('混合对象测试', () => {
  //   const complex = {
  //     date: new Date(),
  //     reg: /test/g,
  //     map: new Map([['key', 'value']]),
  //     set: new Set([1, 2]),
  //     buffer: Buffer.from('test'),
  //     typed: new Uint8Array([1, 2, 3]),
  //     error: new Error('test')
  //   };
  //   const cloned = dkopy(complex);
  //   expect(cloned).toEqual(complex);
  //   expect(cloned).not.toBe(complex);
  //   Object.keys(complex).forEach(key => {
  //     expect(cloned[key]).not.toBe(complex[key]);
  //   });
  // });
});
