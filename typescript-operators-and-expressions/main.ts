const width: number = 5;
const height: number = 7;
const area: number = width * height;

console.log(`Area: ${area}`);
console.log(`typeof area: ${typeof area}`);

const bill: number = 8;
const payment: number = 10;
const change: number = payment - bill;

console.log(`Change: ${change}`);
console.log(`typeof change: ${typeof change}`);

const quizzes: number = 100;
const midterm: number = 95;
const final: number = 95;
const grade: number = (quizzes + midterm + final) / 3;

console.log(`Grade: ${grade}`);
console.log(`typeof grade: ${typeof grade}`);

const firstName: string = 'Malcolm';
const lastName: string = 'Abbott';
const fullName: string = firstName + ' ' + lastName;

console.log(`Full Name: ${fullName}`);
console.log(`typeof fullName: ${typeof fullName}`);

const pH: number = 7;
const isAcidic: boolean = pH < 7;

console.log(`isAcidic: ${isAcidic}`);
console.log(`typeof isAcidic: ${typeof isAcidic}`);

const headCount: number = 300;
const isSparta: boolean = headCount === 300;

console.log(`isSparta: ${isSparta}`);
console.log(`typeof isSparta: ${typeof isSparta}`);

let motto: string = fullName;
motto += ' is the GOAT';

console.log(`motto: ${motto}`);
console.log(`typeof motto: ${typeof motto}`);
