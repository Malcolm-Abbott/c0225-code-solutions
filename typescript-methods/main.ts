interface Book {
  title: string;
  author: string;
}

interface Employee {
  name: string;
  age: number;
  position: string;
}

const heroes = ['tilt', 'dynamite', 'blackjack', 'frenchman'];
let randomNumber = Math.random();
randomNumber *= heroes.length;

const randomIndex = Math.floor(randomNumber);
console.log(`randomIndex: ${randomIndex}`);

const randomHero = heroes[randomIndex];
console.log('randomHero: ', randomHero);

const library: Book[] = [
  {
    title: 'Across The Fence',
    author: 'John Stryker Meyer',
  },
  {
    title: 'Whiskey Tango Foxtrot',
    author: 'Lynn Black Jr.',
  },
  {
    title: 'Codename DYNAMITE',
    author: 'Henry Dick Thompson',
  },
];

const lastBook = library.pop();
console.log(`lastBook: `, lastBook);

const firstBook = library.shift();
console.log('firstBook: ', firstBook);

const js = {
  title: 'JavaScript for Impatient Programmers',
  author: 'Dr. Axel Rauschmayer',
};
const css = {
  title: 'CSS Secrets',
  author: 'Lea Verou',
};

library.push(js);
library.unshift(css);
library.splice(1, 1);
console.log('library: ', library);

const fullName = 'Malcolm Abbott';
const firstAndLastName = fullName.split(' ');
console.log('firstAndLastName: ', firstAndLastName);
const firstName = firstAndLastName[0];
const sayMyName = firstName.toUpperCase();
console.log(`sayMyName: ${sayMyName}`);

const employee: Employee = {
  name: 'Alexa Abbott',
  age: 34,
  position: 'business performance analyst',
};

const employeeKeys = Object.keys(employee);
console.log('employeeKeys: ', employeeKeys);
const employeeValues = Object.values(employee);
console.log('employeeValues: ', employeeValues);
const employeePairs = Object.entries(employee);
console.log('employeePairs: ', employeePairs);
