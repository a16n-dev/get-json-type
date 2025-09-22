import { describe, it, expect } from 'vitest';
import { getJsonType } from './index';

describe('getJsonType', () => {
  // Primitive types tests
  describe('primitive types', () => {
    it('should return "null" for null', () => {
      expect(getJsonType(null)).toBe('null');
    });

    it('should return "string" for strings', () => {
      expect(getJsonType('hello')).toBe('string');
      expect(getJsonType('')).toBe('string');
    });

    it('should return "number" for numbers', () => {
      expect(getJsonType(42)).toBe('number');
      expect(getJsonType(0)).toBe('number');
      expect(getJsonType(-1.5)).toBe('number');
    });

    it('should return "boolean" for booleans', () => {
      expect(getJsonType(true)).toBe('boolean');
      expect(getJsonType(false)).toBe('boolean');
    });
  });

  // Array tests
  describe('arrays', () => {
    it('should return "any[]" for empty arrays', () => {
      expect(getJsonType([])).toBe('any[]');
    });

    it('should return typed arrays for homogeneous arrays', () => {
      expect(getJsonType([1, 2, 3])).toBe('number[]');
      expect(getJsonType(['a', 'b', 'c'])).toBe('string[]');
      expect(getJsonType([true, false])).toBe('boolean[]');
    });

    it('should return union types for heterogeneous arrays', () => {
      expect(getJsonType([1, 'hello', true])).toBe(
        '(number | string | boolean)[]'
      );
      expect(getJsonType([null, 'test'])).toBe('(null | string)[]');
    });
  });

  // Object tests
  describe('objects', () => {
    it('should handle simple objects', () => {
      const result = getJsonType({ name: 'John', age: 30 });
      expect(result).toBe('{ name: string; age: number }');
    });

    it('should handle nested objects', () => {
      const result = getJsonType({
        user: { name: 'John', active: true },
        count: 5,
      });
      expect(result).toBe(
        '{ user: { name: string; active: boolean }; count: number }'
      );
    });

    it('should handle objects with arrays', () => {
      const result = getJsonType({
        tags: ['red', 'blue'],
        scores: [1, 2, 3],
      });
      expect(result).toBe('{ tags: string[]; scores: number[] }');
    });
  });

  // Formatting options tests
  describe('formatting options', () => {
    const testObj = {
      name: 'John',
      details: {
        age: 30,
        active: true,
      },
    };

    it('should format multiline with default indent', () => {
      const result = getJsonType(testObj, { multiline: true });
      const expected = `{
  name: string;
  details: {
    age: number;
    active: boolean;
  };
}`;
      expect(result).toBe(expected);
    });

    it('should format multiline with custom indent size', () => {
      const result = getJsonType(testObj, { multiline: true, indentSize: 4 });
      const expected = `{
    name: string;
    details: {
        age: number;
        active: boolean;
    };
}`;
      expect(result).toBe(expected);
    });

    it('should format single line by default', () => {
      const result = getJsonType(testObj);
      expect(result).toBe(
        '{ name: string; details: { age: number; active: boolean } }'
      );
    });
  });

  // Type name tests
  describe('typeName option', () => {
    const testObj = {
      name: 'John',
      details: {
        age: 30,
        active: true,
      },
    };

    it('should generate type declaration for single line format', () => {
      const result = getJsonType(testObj, { typeName: 'User' });
      expect(result).toBe(
        'type User = { name: string; details: { age: number; active: boolean } }'
      );
    });

    it('should generate type declaration for multiline format', () => {
      const result = getJsonType(testObj, {
        typeName: 'UserProfile',
        multiline: true,
      });
      const expected = `type UserProfile = {
  name: string;
  details: {
    age: number;
    active: boolean;
  };
}`;
      expect(result).toBe(expected);
    });

    it('should generate type declaration for multiline with custom indent', () => {
      const result = getJsonType(testObj, {
        typeName: 'UserData',
        multiline: true,
        indentSize: 4,
      });
      const expected = `type UserData = {
    name: string;
    details: {
        age: number;
        active: boolean;
    };
}`;
      expect(result).toBe(expected);
    });

    it('should work with primitive types', () => {
      const result = getJsonType('hello', { typeName: 'Greeting' });
      expect(result).toBe('type Greeting = string');
    });

    it('should work with arrays', () => {
      const result = getJsonType([1, 2, 3], { typeName: 'Numbers' });
      expect(result).toBe('type Numbers = number[]');
    });
  });

  // Error handling tests
  describe('error handling', () => {
    it('should return "any" by default for unsupported types', () => {
      const result = getJsonType(undefined as any);
      expect(result).toBe('any');
    });

    it('should throw error when throwOnUnknown is true', () => {
      expect(() => {
        getJsonType(undefined as any, { throwOnUnknown: true });
      }).toThrow('Unknown JSON type: undefined');
    });
  });
});
