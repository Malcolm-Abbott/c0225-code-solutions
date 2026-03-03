'use strict';
const values = [10, 1, 22, 23, 41, 5, 18, 7, 80, 9];
values.forEach((value) => console.log(value));
values.forEach((_value, index) => {
  console.log(values[values.length - 1 - index]);
});
