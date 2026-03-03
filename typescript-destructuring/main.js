'use strict';
const book1 = {
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald',
  libraryId: 12345,
};
const { title, author, libraryId } = book1;
console.log(
  `The title of the book is ${title}, the author is ${author}, and the library ID is ${libraryId}`
);
const book2 = {
  title: '1984',
  author: 'George Orwell',
  libraryId: 67890,
};
const { title: title2, author: author2, libraryId: libraryId2 } = book2;
console.log(
  `The title of the book is ${title2}, the author is ${author2}, and the library ID is ${libraryId2}`
);
const library = [
  {
    title: 'The Road Ahead',
    author: 'Bill Gates',
    libraryId: 1254,
  },
  {
    title: 'Walter Isaacson',
    author: 'Steve Jobs',
    libraryId: 4264,
  },
  {
    title: 'Mockingjay: The Final Book of The Hunger Games',
    author: 'Suzanne Collins',
    libraryId: 3245,
  },
  {
    title: "Dead Dead Demon's De De De De Destruction",
    author: 'Inio Asano',
    libraryId: 1233,
  },
];
const [book3, book4, book5] = library;
const [, , , book6] = library;
console.log('book3:', book3);
console.log('book4:', book4);
console.log('book5:', book5);
console.log('book6:', book6);
