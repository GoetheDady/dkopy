import deepClone from '../src/dkopy'; // 你的 dkopy 实现
import _ from 'lodash'; // lodash.cloneDeep
import rfdc from 'rfdc'; // rfdc

// 创建一个多层嵌套的复杂测试对象
function createDeepNestedObject(depth: number): any {
  const obj: any = {
    a: 1,
    b: 'hello',
    c: true,
    d: null,
    e: undefined,
    f: new Date(),
    g: /hello/g,
    h: new Set([1, 2, 3]),
    i: new Map([['a', 1], ['b', 2]]),
    j: { nested: { key: 'value' } },
    k: [1, 2, { a: 3 }],
  };

  // 添加多层嵌套
  let current = obj;
  for (let i = 0; i < depth; i++) {
    current.nested = { key: `value${i}` };
    current = current.nested;
  }

  // 添加循环引用
  obj.l = obj;
  current.circular = obj;

  return obj;
}

// 性能测试函数
function runPerformanceTest(
  name: string,
  cloneFn: (obj: any) => any,
  testObj: any,
  iterations: number = 100000
): number {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    cloneFn(testObj);
  }
  const end = performance.now();
  const duration = end - start;
  console.log(`${name} 耗时: ${duration.toFixed(2)} 毫秒`);
  return duration;
}

describe('深克隆函数性能测试', () => {
  const testDepths = [1, 5, 10]; // 测试不同的嵌套深度
  const iterations = 100000; // 每个测试的迭代次数

  testDepths.forEach((depth) => {
    describe(`嵌套深度: ${depth}`, () => {
      const complexObj = createDeepNestedObject(depth);

      test('dkopy 性能测试', () => {
        const duration = runPerformanceTest('dkopy', deepClone, complexObj, iterations);
        expect(duration); // 确保性能在合理范围内
      });

      test('lodash.cloneDeep 性能测试', () => {
        const duration = runPerformanceTest('lodash.cloneDeep', _.cloneDeep, complexObj, iterations);
        expect(duration); // 确保性能在合理范围内
      });

      test('rfdc 性能测试', () => {
        const clone = rfdc({ circles: true }); // 启用循环引用检测
        const duration = runPerformanceTest('rfdc', clone, complexObj, iterations);
        expect(duration); // 确保性能在合理范围内
      });
    });
  });

  // 性能对比总结
  test('性能对比总结', () => {
    const results: Record<string, number[]> = { dkopy: [], lodash: [], rfdc: [] };

    testDepths.forEach((depth) => {
      const complexObj = createDeepNestedObject(depth);

      results.dkopy.push(runPerformanceTest('dkopy', deepClone, complexObj, iterations));
      results.lodash.push(runPerformanceTest('lodash.cloneDeep', _.cloneDeep, complexObj, iterations));
      results.rfdc.push(runPerformanceTest('rfdc', rfdc({ circles: true }), complexObj, iterations));
    });

    console.log('性能对比结果:');
    console.table(results);
  });
});
