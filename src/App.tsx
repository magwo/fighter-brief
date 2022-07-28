import React, { useState } from 'react';
import Toolbar from './Toolbar/Toolbar';
import './App.css';
import Workspace from './Workspace/Workspace';
import Controlbar from './Controlbar/Controlbar';

function App() {
  const [selectedButton, setSelectedButton] = useState<string>('viper');
  const [shouldPlay, setShouldPlay] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [timeDelta, setTimeDelta] = useState<number>(0);

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <Workspace activeTool={selectedButton} shouldPlay={shouldPlay} timeDelta={timeDelta} time={time} />
      <Toolbar onToolSelected={(button: string) => setSelectedButton(button)} />
      <Controlbar onPlayPause={(shouldPlay: boolean) => setShouldPlay(shouldPlay)} onTimeChange={(timeDelta, time) => { setTimeDelta(timeDelta); setTime(time) }} />
    </div>
  );
}

export default App;
