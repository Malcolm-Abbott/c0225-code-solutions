import './App.css';
import { AppContentContainer } from './AppContentContainer';
import { useState } from 'react';

function getButtonStyle(clicks: number): string {
  switch (true) {
    // case clicks < 3:
    //   return 'base';
    // case clicks >= 3:
    //   return 'cold';
    // case clicks < 6:
    //   return 'cool';
    // case clicks < 9:
    //   return 'tepid';
    // case clicks < 12:
    //   return 'warm';
    // case clicks < 15:
    //   return 'hot';
    // case clicks < 18:
    //   return 'nuclear';
    case clicks >= 18:
      return 'nuclear';
    case clicks >= 15:
      return 'hot';
    case clicks >= 12:
      return 'warm';
    case clicks >= 9:
      return 'tepid';
    case clicks >= 6:
      return 'cool';
    case clicks >= 3:
      return 'cold';
    default:
      return '';
  }
}

function App() {
  const [clicks, setClicks] = useState(0);
  const style = getButtonStyle(clicks);

  return (
    <>
      <AppContentContainer
        clicks={clicks}
        setClicks={setClicks}
        style={style}
      />
    </>
  );
}

export default App;
