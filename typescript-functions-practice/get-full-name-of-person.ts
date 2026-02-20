/* exported getFullNameOfPerson */
interface Person {
  firstName: string;
  lastName: string;
}

// const getFullNameOfPerson = (person: Person): string =>
//   `${person.firstName} ${person.lastName}`;
function getFullNameOfPerson(person: Person): string {
  return `${person.firstName} ${person.lastName}`;
}
