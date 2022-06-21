import isPlainObject from 'lodash.isplainobject';
import union from 'lodash.union';
import sortBy from 'lodash.sortby';
import has from 'lodash.has';
import parse from './parsers.js';

const getObjectsKeys = (object1, object2) => union(Object.keys(object1), Object.keys(object2));

const generateDifference = (filepath1, filepath2) => {
  const [file1, file2] = [parse(filepath1), parse(filepath2)];

  const iter = (obj1, obj2) => {
    const allKeys = getObjectsKeys(obj1, obj2);

    const result = allKeys.map((key) => {
      if (isPlainObject(obj1[key]) && isPlainObject(obj2[key])) {
        return {
          key,
          type: 'tree',
          children: iter(obj1[key], obj2[key]),
        };
      }

      if (obj1[key] === obj2[key]) {
        return {
          key,
          type: 'unchanged',
          oldValue: obj1[key],
        };
      }

      if (has(obj1, key) && !has(obj2, key)) {
        return {
          key,
          type: 'deleted',
          oldValue: obj1[key],
        };
      }

      if (!has(obj1, key) && has(obj2, key)) {
        return {
          key,
          type: 'added',
          newValue: obj2[key],
        };
      }

      if (obj1[key] !== obj2[key]) {
        return {
          key,
          type: 'changed',
          oldValue: obj1[key],
          newValue: obj2[key],
        };
      }

      return new Error(`UNEXPECTED_KEY: ${key}`);
    });

    return sortBy(result, 'key');
  };

  return iter(file1, file2);
};

export default generateDifference;
