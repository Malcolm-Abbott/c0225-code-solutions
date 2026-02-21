/* exported getIndexes */
function getIndexes(array: unknown[]): number[] {
  const indexes: number[] = [];
  array.forEach((element, index) => {
    if (element) indexes.push(index);
  });
  return indexes;
}
