import './App.css';
import { RegistrationFormControlled } from './Components/RegistrationFormControlled';
import { RegistrationFormUncontrolled } from './Components/RegistrationFormUncontrolled';

function App() {
  return (
    <>
      <RegistrationFormUncontrolled />
      <RegistrationFormControlled />
    </>
  );
}

export default App;
