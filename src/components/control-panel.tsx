import '../control-panel.css';
import React from 'react';

export function ControlPanel({ onHome }: { onHome: () => void }) {
  return (
    <div>
      <button onClick={onHome}>Home</button>
    </div>
  );
}
