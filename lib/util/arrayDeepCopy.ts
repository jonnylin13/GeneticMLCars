interface Array<T> {
  deepCopy(): Array<T>;
}

Array.prototype.deepCopy = function() {
  const newArr = this.slice(0);
  for (let i = newArr.length; i--; ) {
    if (this[i] instanceof Array) newArr[i] = this[i].deepCopy();
  }
  return newArr;
};
