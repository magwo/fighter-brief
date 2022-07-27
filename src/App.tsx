import React, { useState } from 'react';
import Toolbar from './Toolbar/Toolbar';
import './App.css';
import Workspace from './Workspace/Workspace';
import Controlbar from './Controlbar/Controlbar';

function App() {
  const [selectedButton, setSelectedButton] = useState<string>('viper');
  const [shouldPlay, setShouldPlay] = useState<boolean>(false);

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <Workspace activeTool={selectedButton} shouldPlay={shouldPlay} />
      <Toolbar onToolSelected={(button: string) => { setSelectedButton(button); }} />
      <Controlbar onPlayPause={(shouldPlay: boolean) => { console.log("Onplaypayse", shouldPlay); setShouldPlay(shouldPlay); }} />
    </div>
  );
}

export default App;
