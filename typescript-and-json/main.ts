interface Book {
  isbn: string;
  title: string;
  author: string;
}

interface Student {
  id: number;
  name: string;
}

const arrayOfBooks: Book[] = [
  {
    isbn: 'isbn1',
    title: 'title1',
    author: 'author1',
  },
  {
    isbn: 'isbn2',
    title: 'title2',
    author: 'author2',
  },
  {
    isbn: 'isbn3',
    title: 'title3',
    author: 'author3',
  },
];

console.log('arrayOfBooks:', arrayOfBooks);
console.log('typeof arrayOfBooks:', typeof arrayOfBooks);

const jsonArrayOfBooks = JSON.stringify(arrayOfBooks);
console.log('jsonArrayOfBooks:', jsonArrayOfBooks);
console.log('typeof jsonArrayOfBooks:', typeof jsonArrayOfBooks);

const studentJSON = '{ "id": 1, "name": "Alexa Abbott" }';
console.log('studentJSON:', studentJSON);
console.log('typeof studentJSON:', typeof studentJSON);

const student: Student = JSON.parse(studentJSON);
console.log('student:', student);
console.log('typeof student:', typeof student);
