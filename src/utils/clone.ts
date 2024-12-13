import dkopy from '../dkopy';

export function shallowCloneErrorObject(data: Error): Error {
  const clone = new Error(data.message);
  clone.name = data.name;
  clone.stack = data.stack;

  Object.getOwnPropertyNames(data).forEach(key => {
    if (!['name', 'message', 'stack'].includes(key)) {
      (clone as any)[key] = (data as any)[key];
    }
  })

  return clone
}

export function deepCloneErrorObject(data: Error): Error {
  const clone = new Error(data.message);
  clone.name = data.name;
  clone.stack = data.stack;

  Object.getOwnPropertyNames(data).forEach(key => {
    if (!['name', 'message', 'stack'].includes(key)) {
      (clone as any)[key] = dkopy((data as any)[key], { deep: true });
    }
  });

  return clone;
}