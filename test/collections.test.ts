import { deepClone, shallowClone } from '../src';

describe('集合类型测试', () => {
  describe('Set', () => {
    test('应该正确深克隆Set', () => {
      const original = new Set([1, { a: 2 }, [3]]);
      const cloned = deepClone(original);

      expect(cloned instanceof Set).toBe(true);
      expect(cloned).not.toBe(original);
      expect(Array.from(cloned)).toEqual(Array.from(original));
      expect(Array.from(cloned)[1]).not.toBe(Array.from(original)[1]);
    });

    test('应该正确浅克隆Set', () => {
      const obj = { a: 2 };
      const original = new Set([1, obj, [3]]);
      const cloned = shallowClone(original);

      expect(cloned instanceof Set).toBe(true);
      expect(cloned).not.toBe(original);
      expect(Array.from(cloned)[1]).toBe(obj);
    });
  });

  describe('Map', () => {
    test('应该正确深克隆Map', () => {
      const original = new Map<string | { b: number }, string | { a: number }>([
        ['key1', { a: 1 }],
        [{ b: 2 }, 'value2']
      ]);
      const cloned = deepClone(original);

      expect(cloned instanceof Map).toBe(true);
      expect(cloned).not.toBe(original);
      expect(cloned.get('key1')).toEqual(original.get('key1'));
      expect(cloned.get('key1')).not.toBe(original.get('key1'));
    });

    test('应该正确浅克隆Map', () => {
      const value = { a: 1 };
      const original = new Map([
        ['key1', value]
      ]);
      const cloned = shallowClone(original);

      expect(cloned instanceof Map).toBe(true);
      expect(cloned).not.toBe(original);
      expect(cloned.get('key1')).toBe(value);
    });
  });
});
