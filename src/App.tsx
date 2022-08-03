import React, { useState } from 'react';
import { Tool, toolCategories } from './Toolbar/tools';
import './App.css';
import Workspace from './Workspace/Workspace';
import Controlbar from './Controlbar/Controlbar';
import Toolbar from './Toolbar/Toolbar';

function App() {
  const [selectedTool, setSelectedTool] = useState<Tool>(toolCategories[0].tools[0]);
  const [shouldPlay, setShouldPlay] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [stopTime, setStopTime] = useState<number>(1);

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <Workspace tool={selectedTool} shouldPlay={shouldPlay} time={time} onStopTimeChange={(stopTime: number) => { setStopTime(stopTime); if (time < stopTime) { setTime(stopTime); } }} />
      <Toolbar onToolSelected={(tool: Tool) => setSelectedTool(tool)} />
      <Controlbar stopTime={stopTime} onPlayPause={(shouldPlay: boolean) => setShouldPlay(shouldPlay)} onTimeChange={(time) => { setTime(time) }} />
    </div>
  );
}

export default App;
