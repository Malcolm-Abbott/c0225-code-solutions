interface StudentProps {
  firstName: string;
  lastName: string;
  age: number;
  livesInIrvine?: boolean;
  previousOccupation?: string;
}

interface Vehicle {
  make: string;
  model: string;
  year: number;
  color?: string;
  isConvertible?: boolean;
}

interface Pet {
  name?: string;
  kind?: string;
}

const student: StudentProps = {
  firstName: 'Alexa',
  lastName: 'Abbott',
  age: 34,
};

const fullName: string = `${student.firstName} ${student.lastName}`;
console.log(`fullName: ${fullName}`);

student.livesInIrvine = false;
student.previousOccupation = 'performance analyst';
console.log(`livesInIrvine: ${student.livesInIrvine}`);
console.log(`previousOccupation: ${student.previousOccupation}`);
console.log('student object: ', student);
console.log(`typeof student: ${typeof student}`);

const vehicle: Vehicle = {
  make: 'Toyota',
  model: '4runner',
  year: 2025,
};

vehicle['color'] = 'Everest Green';
vehicle['isConvertible'] = false;
console.log('vehicle: ', vehicle);
console.log(`typeof vehicle: ${typeof vehicle}`);

const pet: Pet = {
  name: 'Ava la Pechocha',
  kind: 'Dog',
};

delete pet.name;
delete pet.kind;
console.log('pet: ', pet);
console.log(`typeof pet: ${typeof pet}`);
