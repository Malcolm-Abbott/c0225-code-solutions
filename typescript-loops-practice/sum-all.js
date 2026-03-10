'use strict';
/* exported sumAll */
function sumAll(numbers) {
  let sum = 0;
  for (const num of numbers) {
    sum += num;
  }
  return sum;
}
