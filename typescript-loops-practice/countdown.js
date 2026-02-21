'use strict';
/* exported countdown */
function countdown(num) {
  const numArr = [];
  while (num >= 0) {
    numArr.push(num);
    num--;
  }
  return numArr;
}
