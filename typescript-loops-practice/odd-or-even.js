'use strict';
/* exported oddOrEven */
function oddOrEven(numbers) {
  // const result = numbers.map((number) => (number % 2 === 0 ? 'even' : 'odd'));
  const result = [];
  for (const number of numbers) {
    number % 2 === 0 ? result.push('even') : result.push('odd');
  }
  return result;
}
