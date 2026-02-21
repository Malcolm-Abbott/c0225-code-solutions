'use strict';
/* exported getIndexes */
function getIndexes(array) {
  const indexes = [];
  array.forEach((element, index) => {
    if (element) indexes.push(index);
  });
  return indexes;
}
