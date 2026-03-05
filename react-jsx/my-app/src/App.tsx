import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(() => {
    const savedCount = localStorage.getItem('count');
    return savedCount !== null ? +savedCount : 0;
  });

  useEffect(() => {
    localStorage.setItem('count', count.toString());
  }, [count]);

  return (
    <>
      <h1>React JSX</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Total Button Clicks: {count}
        </button>
        <p>
          JSX (JavaScript XML) is a syntax extension for JavaScript that allows
          you to write HTML-like markup directly inside your JavaScript files.
          It is primarily used with React to describe what the user interface
          (UI) should look like.
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <button onClick={() => setCount(0)}>Reset Count</button>
    </>
  );
}

export default App;
