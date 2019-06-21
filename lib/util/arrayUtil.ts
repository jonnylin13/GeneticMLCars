export function deepCopy(arr: Array<any>) {
  const newArr = arr.slice(0);
  for (var i = newArr.length; i--; ) {
    if (newArr[i] instanceof Array) newArr[i] = deepCopy(newArr[i]);
  }
  return newArr;
}
