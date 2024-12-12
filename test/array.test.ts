import { deepClone, shallowClone } from '../src';

describe('Array Tests', () => {
  describe('deepClone', () => {
    test('应该深度克隆简单数组', () => {
      const original = [1, 2, 3, 4];
      const cloned = deepClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });

    test('应该深度克隆嵌套数组', () => {
      const original = [1, [2, 3], [4, [5, 6]]];
      const cloned = deepClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned[1]).not.toBe(original[1]);
      expect(cloned[2]).not.toBe(original[2]);
    });
  });

  describe('shallowClone', () => {
    test('应该浅克隆简单数组', () => {
      const original = [1, 2, 3, 4];
      const cloned = shallowClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });

    test('应该浅克隆嵌套数组但保持内部引用', () => {
      const innerArray = [2, 3];
      const original = [1, innerArray, [4, 5]];
      const cloned = shallowClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[1]).toBe(original[1]);
      expect(cloned[2]).toBe(original[2]);
    });
  });
});
