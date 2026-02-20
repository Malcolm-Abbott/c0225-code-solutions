/* exported getDescriptionOfPerson */
interface Person {
  name: string;
  occupation: string;
  birthPlace: string;
}

// const getDescriptionOfPerson = (person: Person): string =>
//   `${person.name} is a ${person.occupation} from ${person.birthPlace}.`;
function getDescriptionOfPerson(person: Person): string {
  return `${person.name} is a ${person.occupation} from ${person.birthPlace}.`;
}
