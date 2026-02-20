'use strict';
function isUnderFive(number) {
  return number < 5;
}
function isEven(number) {
  return number % 2 === 0;
}
function startsWithJ(string) {
  return string[0] === 'J';
}
function isOldEnoughToDrink(person) {
  return person.age >= 21;
}
function isOldEnoughToDrive(person) {
  return person.age >= 16;
}
function isOldEnoughToDrinkAndDrive(person) {
  return false;
}
function categorizeAcidity(pH) {
  switch (true) {
    case pH === 7:
      return 'neutral';
    case pH < 7 && pH >= 0:
      return 'acid';
    case pH > 7 && pH <= 14:
      return 'base';
    default:
      return 'invalid pH level';
  }
}
function introduceWarnerBro(name) {
  switch (name) {
    case 'yakko':
      return `We're the warner brothers!`;
    case 'wakko':
      return `We're the warner brothers!`;
    case 'dot':
      return `I'm cute~`;
    default:
      return 'Goodnight everybody!';
  }
}
function recommendMovie(genre) {
  switch (genre.toLowerCase()) {
    case 'action':
      return 'Die Hard';
    case 'comedy':
      return 'The Big Lebowski';
    case 'horror':
      return 'The IT';
    case 'drama':
      return 'Saving Private Ryan';
    case 'musical':
      return 'Pippin';
    case 'sci-fi':
      return `Enders' Game`;
    default:
      return `Genre not recognized. Choose between action, comedy, horror, drama, musical, or sci-fi`;
  }
}
