'use strict';
/* exported filterOutStrings */
function filterOutStrings(values) {
  // const noStrings: unknown[] = values.filter(
  //   (value) => typeof value !== 'string'
  // );
  const noStrings = [];
  for (const value of values) {
    if (typeof value !== 'string') noStrings.push(value);
  }
  return noStrings;
}
