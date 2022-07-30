import React, { useState } from 'react';
import Toolbar, { Tool, toolButtons } from './Toolbar/Toolbar';
import './App.css';
import Workspace from './Workspace/Workspace';
import Controlbar from './Controlbar/Controlbar';

function App() {
  const [selectedTool, setSelectedTool] = useState<Tool>(toolButtons[0]);
  const [shouldPlay, setShouldPlay] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [stopTime, setStopTime] = useState<number>(1);

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <Workspace tool={selectedTool} shouldPlay={shouldPlay} time={time} onStopTimeChange={(stopTime: number) => setStopTime(stopTime)} />
      <Toolbar onToolSelected={(tool: Tool) => setSelectedTool(tool)} />
      <Controlbar stopTime={stopTime} onPlayPause={(shouldPlay: boolean) => setShouldPlay(shouldPlay)} onTimeChange={(time) => { setTime(time) }} />
    </div>
  );
}

export default App;
