/* exported findIndex */
function findIndex(array: unknown[], value: unknown): number {
  let returnIndex = -1;

  array.forEach((element, index) => {
    if (returnIndex === -1) {
      if (element === value) returnIndex = index;
    }
  });

  return returnIndex;
}
