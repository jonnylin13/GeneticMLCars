export function deepCopy(arr: Array<any>) {
  const newArr = arr.map(arr => {
    return arr.slice();
  });
  return newArr;
}
