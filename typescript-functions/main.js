'use strict';
function convertMinutesToSeconds(minutes) {
  return minutes * 60;
}
const fiveMinutesToSeconds = convertMinutesToSeconds(5);
const tenMinutesToSeconds = convertMinutesToSeconds(10);
console.log(`fiveMinutesToSeconds: ${fiveMinutesToSeconds}`);
console.log(`tenMinutesToSeconds: ${tenMinutesToSeconds}`);
function greet(name) {
  return `Hey ${name}!`;
}
const greetAlexa = greet('Alexa');
const greetMalcolm = greet('Malcolm');
console.log(`greetAlexa: ${greetAlexa}`);
console.log(`greetMalcolm: ${greetMalcolm}`);
const getArea = (width, height) => width * height;
console.log(`getArea(17, 42): ${getArea(17, 42)}`);
console.log(`getArea(22, 38): ${getArea(22, 38)}`);
const getFirstName = (person) => person.firstName;
console.log(
  `getFirstName: ${getFirstName({ firstName: 'Alexa', lastName: 'Abbott' })}`
);
console.log(
  `getFirstName: ${getFirstName({ firstName: 'Malcolm', lastName: 'Abbott' })}`
);
const getLastElement = (array) => array[array.length - 1];
console.log(
  `getLastElement(['propane', 'and', 'propane', 'accessories']): ${getLastElement(
    ['propane', 'and', 'propane', 'accessories']
  )}`
);
console.log(
  `getLastElement([true, true, false, true]): ${getLastElement([
    true,
    true,
    false,
    true,
  ])}`
);
function callOtherFunction(otherFunction, params) {
  return otherFunction(params);
}
console.log(
  `callOtherFunction(convertMinutesToSeconds, 10): ${callOtherFunction(
    convertMinutesToSeconds,
    10
  )}`
);
console.log(
  `callOtherFunction(getLastElement, ['hello', 'Goodbye', 'Aloha']): ${callOtherFunction(
    getLastElement,
    ['hello', 'Goodbye', 'Aloha']
  )}`
);
