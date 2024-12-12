import { deepClone, shallowClone } from '../src';

describe('基础类型测试', () => {
  test('应该正确克隆字符串', () => {
    const original = 'hello world';
    expect(deepClone(original)).toBe(original);
    expect(shallowClone(original)).toBe(original);
  });

  test('应该正确克隆数字', () => {
    const original = 123.456;
    expect(deepClone(original)).toBe(original);
    expect(shallowClone(original)).toBe(original);
  });

  test('应该正确克隆布尔值', () => {
    expect(deepClone(true)).toBe(true);
    expect(shallowClone(false)).toBe(false);
  });

  test('应该正确克隆null和undefined', () => {
    expect(deepClone(null)).toBeNull();
    expect(deepClone(undefined)).toBeUndefined();
    expect(shallowClone(null)).toBeNull();
    expect(shallowClone(undefined)).toBeUndefined();
  });

  test('应该正确克隆Symbol', () => {
    const sym = Symbol('test');
    expect(deepClone(sym)).toBe(sym);
    expect(shallowClone(sym)).toBe(sym);
  });
});
