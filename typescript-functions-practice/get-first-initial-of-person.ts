/* exported getFirstInitialOfPerson */
interface Person {
  firstName: string;
  lastName: string;
}

// const getFirstInitialOfPerson = (person: Person): string => person.firstName[0];
function getFirstInitialOfPerson(person: Person): string {
  return person.firstName[0];
}
