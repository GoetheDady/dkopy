import { deepClone, shallowClone } from '../src';

describe('Date和RegExp测试', () => {
  describe('Date对象', () => {
    test('应该正确深克隆Date对象', () => {
      const original = new Date();
      const cloned = deepClone(original);

      expect(cloned instanceof Date).toBe(true);
      expect(cloned.getTime()).toBe(original.getTime());
      expect(cloned).not.toBe(original);
    });

    test('应该正确浅克隆Date对象', () => {
      const original = new Date();
      const cloned = shallowClone(original);

      expect(cloned instanceof Date).toBe(true);
      expect(cloned.getTime()).toBe(original.getTime());
    });
  });

  describe('RegExp对象', () => {
    test('应该正确深克隆RegExp对象', () => {
      const original = /test/gi;
      const cloned = deepClone(original);

      expect(cloned instanceof RegExp).toBe(true);
      expect(cloned.source).toBe(original.source);
      expect(cloned.flags).toBe(original.flags);
      expect(cloned).not.toBe(original);
    });

    test('应该正确浅克隆RegExp对象', () => {
      const original = /test/gi;
      const cloned = shallowClone(original);

      expect(cloned instanceof RegExp).toBe(true);
      expect(cloned.source).toBe(original.source);
      expect(cloned.flags).toBe(original.flags);
    });
  });
});
