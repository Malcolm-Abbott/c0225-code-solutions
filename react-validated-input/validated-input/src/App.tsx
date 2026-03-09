import './App.css';
import { ValidatedInput } from './ValidatedInput';
import { useState } from 'react';

function App() {
  const [value, setValue] = useState('');

  return (
    <>
      <ValidatedInput value={value} onChange={setValue} />
    </>
  );
}

export default App;
