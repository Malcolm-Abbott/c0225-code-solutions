interface Person {
  firstName: string;
  lastName: string;
}

function convertMinutesToSeconds(minutes: number): number {
  return minutes * 60;
}

const fiveMinutesToSeconds: number = convertMinutesToSeconds(5);
const tenMinutesToSeconds: number = convertMinutesToSeconds(10);
console.log(`fiveMinutesToSeconds: ${fiveMinutesToSeconds}`);
console.log(`tenMinutesToSeconds: ${tenMinutesToSeconds}`);

function greet(name: string): string {
  return `Hey ${name}!`;
}

const greetAlexa: string = greet('Alexa');
const greetMalcolm: string = greet('Malcolm');
console.log(`greetAlexa: ${greetAlexa}`);
console.log(`greetMalcolm: ${greetMalcolm}`);

const getArea = (width: number, height: number): number => width * height;
console.log(`getArea(17, 42): ${getArea(17, 42)}`);
console.log(`getArea(22, 38): ${getArea(22, 38)}`);

const getFirstName = (person: Person): string => person.firstName;
console.log(
  `getFirstName: ${getFirstName({ firstName: 'Alexa', lastName: 'Abbott' })}`
);
console.log(
  `getFirstName: ${getFirstName({ firstName: 'Malcolm', lastName: 'Abbott' })}`
);

const getLastElement = (array: unknown[]): unknown => array[array.length - 1];
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

function callOtherFunction(otherFunction: Function, params: unknown): any {
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
