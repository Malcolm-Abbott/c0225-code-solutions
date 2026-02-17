'use strict';
const fullName = 'Malcolm Abbott';
const isCool = true;
const totalPets = 1;
const empty = null;
const nothing = undefined;
const quickLogs = [fullName, isCool, totalPets, empty, nothing];
function quickLogger(iterable) {
  iterable.forEach((element) => {
    switch (true) {
      case typeof element === 'string':
        console.log(`Full Name: ${element}`);
        break;
      case typeof element === 'boolean':
        console.log(`Is cool: ${element}`);
        break;
      case typeof element === 'number':
        console.log(`Total Number of Pets: ${element}`);
        break;
      case typeof element === 'object':
        console.log(`Empty: ${element}`);
        break;
      case typeof element === 'undefined':
        console.log(`Nothing: ${element}`);
        break;
    }
    console.log(`Element type: ${typeof element}`);
  });
}
quickLogger(quickLogs);
