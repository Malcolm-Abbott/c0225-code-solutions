'use strict';
/* exported includesSeven */
function includesSeven(array) {
  // if (array.includes(7)) return true;
  // return false;
  for (const value of array) {
    if (value === 7) return true;
  }
  return false;
}
