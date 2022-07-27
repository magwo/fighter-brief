import React, { useState } from 'react';
import Toolbar from './Toolbar/Toolbar';
import './App.css';
import Workspace from './Workspace/Workspace';

function App() {

  const [selectedButton, setSelectedButton] = useState('viper');

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <Workspace activeTool={selectedButton} />
      <Toolbar onToolSelected={(button: string) => { setSelectedButton(button); }} />
    </div>
  );
}

export default App;
