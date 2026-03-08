import { useState } from 'react';
import './ToggleSwitch.css';

export function ToggleSwitch() {
  const [isOn, setIsOn] = useState(false);

  return (
    <div className="toggle-switch-container">
      <div
        className={`toggle-switch${isOn ? ' active' : ''}`}
        onClick={() => setIsOn((prev) => !prev)}
        role="switch"
        aria-checked={isOn}>
        <div className="toggle-switch-handle"></div>
      </div>
      <h1 className="toggle-switch-indicator">{isOn ? 'On' : 'Off'}</h1>
    </div>
  );
}
