'use strict';
/* exported filterOutNulls */
function filterOutNulls(values) {
  // const noNulls: unknown[] = values.filter((value) => value !== null);
  const noNulls = [];
  for (const value of values) {
    if (value !== null) noNulls.push(value);
  }
  return noNulls;
}
