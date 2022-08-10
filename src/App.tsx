import React, { useState } from 'react';
import { Tool, toolCategories } from './Toolbar/tools';
import './App.css';
import Workspace from './Workspace/Workspace';
import Controlbar from './Controlbar/Controlbar';
import Toolbar from './Toolbar/Toolbar';
import Mainbar from './Mainbar/Mainbar';
import { MapType } from './battlefield-object-types';

function App() {
  const [scenarioName, setScenarioName] = useState<string>('New scenario');
  const [map, setMap] = useState<MapType>('');
  const [selectedTool, setSelectedTool] = useState<Tool>(toolCategories[0].tools[0]);
  const [shouldPlay, setShouldPlay] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [stopTime, setStopTime] = useState<number>(1);
  const [shouldShowPaths, setShouldShowPaths] = useState<boolean>(true);

  return (
    <div className="App" data-testid="App">
      <header className="App-header">
      </header>
      <Mainbar scenarioName={scenarioName} map={map} onScenarioNameChange={(name) => setScenarioName(name) } onMapChange={(map) => setMap(map) } />
      <Workspace tool={selectedTool} map={map} shouldPlay={shouldPlay} shouldShowPaths={shouldShowPaths} time={time} onStopTimeChange={(stopTime: number) => setStopTime(stopTime)} />
      <Toolbar onToolSelected={(tool: Tool) => setSelectedTool(tool)} />
      <Controlbar stopTime={stopTime} onPlayPause={(shouldPlay: boolean) => setShouldPlay(shouldPlay)} onTimeChange={(time) => { setTime(time) }} onShowPaths={(show) => setShouldShowPaths(show)} />
    </div>
  );
}

export default App;
