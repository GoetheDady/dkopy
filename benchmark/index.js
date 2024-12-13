import Benchmark from 'benchmark';
import { deepClone, shallowClone } from '../dist/index.js';
import { cloneDeep, clone } from 'lodash-es';

// 准备测试数据
const testData = {
  // 基础类型测试
  primitive: {
    number: 123,
    string: 'test',
    boolean: true,
    null: null,
    undefined: undefined
  },
  
  // 小型对象
  small: { a: 1, b: 2, c: 3 },
  
  // 中型对象
  medium: {
    a: 1,
    b: { c: 3, d: [1, 2, 3], e: { f: 6 } },
    g: [4, 5, 6],
    h: new Date(),
    i: /test/,
    j: new Map([['k', 'v']]),
    l: new Set([1, 2, 3])
  },
  
  // 大型对象
  large: Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    name: `item${i}`,
    value: Math.random(),
    data: {
      created: new Date(),
      tags: ['tag1', 'tag2'],
      meta: { status: 'active', priority: i % 3 }
    }
  })),
  
  // 深度嵌套
  nested: {
    l1: {
      l2: {
        l3: {
          l4: {
            l5: {
              value: 'deep',
              array: [1, [2, [3, [4, [5]]]]],
              date: new Date()
            }
          }
        }
      }
    }
  },
  
  // 特殊类型组合
  special: {
    date: new Date(),
    regexp: /test/gi,
    map: new Map([[1, 'one'], [2, 'two']]),
    set: new Set([1, 2, 3]),
    array: [1, 2, [3, 4, [5, 6]]],
    typedArray: new Int32Array([1, 2, 3]),
    buffer: Buffer.from('hello'),
    error: new Error('test error'),
    symbol: Symbol('test'),
    weakMap: new WeakMap(),
    weakSet: new WeakSet()
  }
};

// 深克隆性能测试套件
const deepCloneSuite = new Benchmark.Suite('深克隆性能对比');
deepCloneSuite
  .add('dkopy.deepClone-基础类型', () => {
    deepClone(testData.primitive);
  })
  .add('dkopy.deepClone-小型对象', () => {
    deepClone(testData.small);
  })
  .add('dkopy.deepClone-中型对象', () => {
    deepClone(testData.medium);
  })
  .add('dkopy.deepClone-大型对象', () => {
    deepClone(testData.large);
  })
  .add('dkopy.deepClone-深度嵌套', () => {
    deepClone(testData.nested);
  })
  .add('dkopy.deepClone-特殊类型', () => {
    deepClone(testData.special);
  })
  .add('lodash.cloneDeep-基础类型', () => {
    cloneDeep(testData.primitive);
  })
  .add('lodash.cloneDeep-小型对象', () => {
    cloneDeep(testData.small);
  })
  .add('lodash.cloneDeep-中型对象', () => {
    cloneDeep(testData.medium);
  })
  .add('lodash.cloneDeep-大型对象', () => {
    cloneDeep(testData.large);
  })
  .add('lodash.cloneDeep-深度嵌套', () => {
    cloneDeep(testData.nested);
  })
  .add('lodash.cloneDeep-特殊类型', () => {
    cloneDeep(testData.special);
  })
  .on('cycle', (event) => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('\n深克隆测试结果:');
    console.log('最快的是: ' + this.filter('fastest').map('name'));
    console.log('-------------------\n');
    shallowCloneSuite.run({ 'async': true });
  });

// 浅克隆性能测试套件
const shallowCloneSuite = new Benchmark.Suite('浅克隆性能对比');
shallowCloneSuite
  .add('dkopy.shallowClone-基础类型', () => {
    shallowClone(testData.primitive);
  })
  .add('dkopy.shallowClone-小型对象', () => {
    shallowClone(testData.small);
  })
  .add('dkopy.shallowClone-中型对象', () => {
    shallowClone(testData.medium);
  })
  .add('dkopy.shallowClone-大型对象', () => {
    shallowClone(testData.large);
  })
  .add('dkopy.shallowClone-深度嵌套', () => {
    shallowClone(testData.nested);
  })
  .add('dkopy.shallowClone-特殊类型', () => {
    shallowClone(testData.special);
  })
  .add('lodash.clone-基础类型', () => {
    clone(testData.primitive);
  })
  .add('lodash.clone-小型对象', () => {
    clone(testData.small);
  })
  .add('lodash.clone-中型对象', () => {
    clone(testData.medium);
  })
  .add('lodash.clone-大型对象', () => {
    clone(testData.large);
  })
  .add('lodash.clone-深度嵌套', () => {
    clone(testData.nested);
  })
  .add('lodash.clone-特殊类型', () => {
    clone(testData.special);
  })
  .on('cycle', (event) => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('\n浅克隆测试结果:');
    console.log('最快的是: ' + this.filter('fastest').map('name'));
  });

console.log('开始性能测试...\n');
deepCloneSuite.run({ 'async': true });
