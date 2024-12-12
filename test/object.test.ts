import { deepClone, shallowClone } from '../src';

describe('对象测试', () => {
  describe('deepClone', () => {
    test('应该深度克隆普通对象', () => {
      const original = { a: 1, b: 2, c: { d: 3 } };
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.c).not.toBe(original.c);
    });

    test('应该处理循环引用对象', () => {
      const original: any = { a: 1 };
      original.self = original;

      const cloned = deepClone(original);
      expect(cloned.a).toBe(original.a);
      expect(cloned.self).toEqual(cloned);
    });
  });

  describe('shallowClone', () => {
    test('应该浅克隆对象', () => {
      const nested = { d: 3 };
      const original = { a: 1, b: 2, c: nested };
      const cloned = shallowClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.c).toBe(original.c);
    });
  });
});
