import Benchmark from 'benchmark';
import _ from 'lodash';
import rfdc from 'rfdc';
import { dkopy } from '../dist/index.js';

// 创建一个复杂的测试对象
function createComplexObject() {
  const obj = {
    // 基本类型
    a: 1,
    b: 'hello',
    c: true,
    d: null,
    e: undefined,

    // 复杂类型
    f: new Date(), // Date 对象
    g: /hello/g, // RegExp 对象
    h: new Set([1, 2, 3]), // Set 对象
    i: new Map([['a', 1], ['b', 2]]), // Map 对象

    // 嵌套对象
    j: {
      nested: {
        key: 'value',
      },
    },

    // 嵌套数组
    k: [1, 2, { a: 3 }],

    // 循环引用
    l: null, // 将在下面设置为循环引用
  };

  // 添加循环引用
  obj.l = obj;
  obj.j.circular = obj.j;

  return obj;
}

// 初始化 Benchmark.js 测试套件
const suite = new Benchmark.Suite();

// 添加测试用例
suite
  .add('dkopy', () => dkopy(createComplexObject(), { circles: true }))
  .add('lodash.cloneDeep', () => _.cloneDeep(createComplexObject()))
  .add('rfdc', () => rfdc({ circles: true })(createComplexObject()))
  .on('cycle', (event) => {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log('\n性能测试结果:');
    this.forEach((bench) => {
      console.log(`${bench.name}: ${bench.hz.toFixed(2)} ops/sec`);
    });
    console.log(`最快的实现是: ${this.filter('fastest').map('name')}`);
  })
  .run({ async: true });
