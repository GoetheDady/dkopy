import { deepClone, shallowClone } from '../src';
import { MaxDepthExceededError } from '../src/errors';

describe('复杂对象测试', () => {
  test('应该正确深克隆包含所有类型的复杂对象', () => {
    const date = new Date();
    const regexp = /test/gi;
    const set = new Set([1, 2, 3]);
    const map = new Map([['key', 'value']]);
    
    const original = {
      string: 'hello',
      number: 123,
      boolean: true,
      null: null,
      undefined: undefined,
      symbol: Symbol('test'),
      date: date,
      regexp: regexp,
      array: [1, { nested: true }, [2, 3]],
      set: set,
      map: map,
      object: { a: 1, b: { c: 2 } }
    };

    const cloned = deepClone(original);

    // 验证基本类型
    expect(cloned.string).toBe(original.string);
    expect(cloned.number).toBe(original.number);
    expect(cloned.boolean).toBe(original.boolean);
    expect(cloned.null).toBeNull();
    expect(cloned.undefined).toBeUndefined();
    expect(cloned.symbol).toBe(original.symbol);

    // 验证日期和正则
    expect(cloned.date).not.toBe(original.date);
    expect(cloned.date.getTime()).toBe(original.date.getTime());
    expect(cloned.regexp.source).toBe(original.regexp.source);
    expect(cloned.regexp.flags).toBe(original.regexp.flags);

    // 验证数组和对象
    expect(cloned.array).not.toBe(original.array);
    expect(cloned.array[1]).not.toBe(original.array[1]);
    expect(cloned.object.b).not.toBe(original.object.b);

    // 验证Set和Map
    expect(cloned.set).not.toBe(original.set);
    expect(cloned.map).not.toBe(original.map);
    expect(Array.from(cloned.set)).toEqual(Array.from(original.set));
    expect(Array.from(cloned.map)).toEqual(Array.from(original.map));
  });

  test('应该正确浅克隆包含所有类型的复杂对象', () => {
    const nestedObj = { nested: true };
    const date = new Date();
    const set = new Set([1, 2, 3]);
    
    const original = {
      primitive: 123,
      object: nestedObj,
      date: date,
      set: set,
      array: [1, 2, 3]
    };

    const cloned = shallowClone(original);

    expect(cloned).not.toBe(original);
    expect(cloned.object).toBe(nestedObj);
    expect(cloned.date).toBe(date);
    expect(cloned.set).toBe(set);
    expect(cloned.array).toBe(original.array);
  });

  test('应该正确处理循环引用', () => {
    const circular: any = {
      name: 'circular'
    };
    circular.self = circular;
    circular.arr = [circular];

    const cloned = deepClone(circular);
    
    expect(cloned).not.toBe(circular);
    expect(cloned.self).toBe(cloned);
    expect(cloned.arr[0]).toBe(cloned);
  });

  test('当启用循环引用检测时应该正确处理循环引用', () => {
    const circular: any = {
      name: 'circular'
    };
    circular.self = circular;
    circular.arr = [circular];

    const cloned = deepClone(circular, { circularReference: true });
    
    expect(cloned).not.toBe(circular);
    expect(cloned.self).toBe(cloned);
    expect(cloned.arr[0]).toBe(cloned);
  });

  test.skip('当未开启循环引用检测且存在循环引用时应导致调用栈溢出', () => {
    const circular: any = {
      name: 'circular'
    };
    circular.self = circular;

    // 注意：这个测试用例会导致实际的栈溢出
    // 仅用于演示未开启循环引用检测的后果
    expect(() => {
      deepClone(circular);
    }).toThrow('Maximum call stack size exceeded');
  });

  test('应该正确处理 Buffer 类型', () => {
    const original = {
      buffer: Buffer.from('test'),
      nested: {
        buffer: Buffer.from('nested')
      }
    };

    const cloned = deepClone(original);
    
    expect(cloned.buffer).not.toBe(original.buffer);
    expect(cloned.buffer.toString()).toBe('test');
    expect(cloned.nested.buffer).not.toBe(original.nested.buffer);
    expect(cloned.nested.buffer.toString()).toBe('nested');
  });

  test('应该正确处理嵌套的 Map 和 Set', () => {
    const innerSet = new Set([1, 2]);
    const innerMap = new Map([['a', 1], ['b', 2]]);
    
    const original = new Map<string, Set<any> | Map<string, any>>([
      ['set', new Set([innerSet, 3, 4])],
      ['map', new Map([['inner', innerMap]])]
    ]);

    const cloned = deepClone(original);
    
    expect(cloned).not.toBe(original);
    const clonedSet = cloned.get('set') as Set<any>;
    const clonedInnerSet = Array.from(clonedSet)[0];
    expect(clonedInnerSet).not.toBe(innerSet);
    expect(Array.from(clonedInnerSet)).toEqual([1, 2]);

    const clonedMap = cloned.get('map') as Map<string, any>;
    const clonedInnerMap = clonedMap.get('inner');
    expect(clonedInnerMap).not.toBe(innerMap);
    expect(Array.from(clonedInnerMap.entries())).toEqual([['a', 1], ['b', 2]]);
  });

  // test('应该正确处理函数类型', () => {
  //   const original = {
  //     fn: function() { return 42; },
  //     arrow: () => 'arrow',
  //     nested: {
  //       method() { return 'method'; }
  //     }
  //   };

  //   const cloned = deepClone(original);
    
  //   expect(typeof cloned.fn).toBe('function');
  //   expect(cloned.fn()).toBe(42);
  //   expect(cloned.arrow()).toBe('arrow');
  //   expect(cloned.nested.method()).toBe('method');
  // });

  test('应该正确处理 TypedArray', () => {
    const original = {
      int8Array: new Int8Array([1, 2, 3]),
      uint8Array: new Uint8Array([4, 5, 6]),
      float32Array: new Float32Array([1.1, 2.2, 3.3])
    };

    const cloned = deepClone(original);
    
    expect(cloned.int8Array).not.toBe(original.int8Array);
    expect(Array.from(cloned.int8Array)).toEqual([1, 2, 3]);
    expect(cloned.uint8Array instanceof Uint8Array).toBeTruthy();
    expect(cloned.float32Array instanceof Float32Array).toBeTruthy();
  });

  test('应该在超出最大深度时抛出错误', () => {
    // 创建一个嵌套对象，深度为 20（默认最大深度）
    let deepObj: any = { value: 1 };
    let current = deepObj;
    for (let i = 0; i < 22; i++) {
      current.nested = { value: i + 2 };
      current = current.nested;
    }

    // 验证超出最大深度时会抛出错误
    expect(() => deepClone(deepObj)).toThrow(MaxDepthExceededError);
    
    // 验证设置更大的maxDepth时可以成功克隆
    expect(() => deepClone(deepObj, { maxDepth: 25 })).not.toThrow();
  });
});
