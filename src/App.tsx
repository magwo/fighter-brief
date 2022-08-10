import React, { useEffect, useState } from 'react';
import { Tool, toolCategories } from './Toolbar/tools';
import './App.css';
import Workspace from './Workspace/Workspace';
import Controlbar from './Controlbar/Controlbar';
import Toolbar from './Toolbar/Toolbar';
import Mainbar from './Mainbar/Mainbar';
import { MapType } from './battlefield-object-types';
import { loadData, serializeData } from './battlefield-object-persister';
import { BattlefieldObject, getStopTime, update as updateObject } from './battlefield-object';
import ObjectEditor from './ObjectEditor/ObjectEditor';

const updateUrl = (_scenarioName: string, _map: MapType, _objects: BattlefieldObject[]) => {
  const serialized = serializeData(_scenarioName, _map, _objects);
  window.location.hash = serialized;
}

function updateAllObjects(objects: BattlefieldObject[], time: number) {
  objects.forEach((obj) => {
    updateObject(obj, time);
  });
}

const getFinalStopTime = (newObjects: BattlefieldObject[], extraObject: BattlefieldObject | null): number => {
  let max = 1;
  newObjects.forEach((obj) => {
    max = Math.max(max, getStopTime(obj));
  });
  if (extraObject !== null) {
    max = Math.max(max, getStopTime(extraObject));
  }
  return max;
}


function App() {
  const [scenarioName, setScenarioName] = useState<string>('New scenario');
  const [map, setMap] = useState<MapType>('');
  const [objects, setObjects] = useState<BattlefieldObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<BattlefieldObject | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>(toolCategories[0].tools[0]);
  const [shouldPlay, setShouldPlay] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [pseudoTime, setPseudoTime] = useState<number | null>(null);
  const [stopTime, setStopTime] = useState<number>(1);
  const [shouldShowPaths, setShouldShowPaths] = useState<boolean>(true);

  const loadFromUrl = () => {
    // Load initial objects
    if (window.location.hash.length > 0) {
      const { scenarioName, mapBackground, loadedObjects } = loadData(window.location.hash);
      console.log("Scenario name is", scenarioName);
      console.log("Map background is", mapBackground);
      console.log("Initial objects", loadedObjects);
      updateAllObjects(loadedObjects, 0);
      setObjects(loadedObjects);
      setScenarioName(scenarioName);
      setMap(mapBackground);
      setStopTime(getFinalStopTime(loadedObjects, null));
      // checkStopTime(loadedObjects);
    }
  };

  const handleScenarioNameChange = (name: string) => {
    setScenarioName(name);
    updateUrl(name, map, objects);
  };

  const handleMapChange = (map: MapType) => {
    setMap(map);
    updateUrl(scenarioName, map, objects);
  };

  const handleObjectsChange = (newObjects: BattlefieldObject[], extraObject: BattlefieldObject | null) => {
    updateAllObjects(newObjects, time); // TODO: Maybe consider pseudoTime?
    const newStopTime = getFinalStopTime(newObjects, extraObject);
    if (newStopTime !== stopTime) {
      setStopTime(newStopTime);
    }
    setObjects(newObjects);
    updateUrl(scenarioName, map, newObjects);
  };

  const handleTimeChange = (time: number) => {
    updateAllObjects(objects, time);
    setTime(time);
  }

  const handlePseudoTimeChange = (pseudoTime: number | null) => {
    updateAllObjects(objects, pseudoTime ?? time);
    setPseudoTime(pseudoTime);
  }

  const handleObjectSelected = (obj: BattlefieldObject | null) => {
    setSelectedObject(obj);
  }

  const handleObjectModified = (obj: BattlefieldObject) => {
    const newObjects = objects.map(o => (o.id === obj.id ? { ...obj } : o))
    // TODO: What actually happens when the selected object here?
    handleObjectsChange(newObjects, null);
  }

  useEffect(() => {
    loadFromUrl();
  }, []);

  return (
    <div className="App" data-testid="App">
      <header className="App-header">
      </header>
      <Mainbar scenarioName={scenarioName} map={map} onScenarioNameChange={handleScenarioNameChange} onMapChange={handleMapChange} />
      <Workspace objects={objects} selectedObject={selectedObject} tool={selectedTool} map={map} shouldPlay={shouldPlay} shouldShowPaths={shouldShowPaths} time={time} pseudoTime={pseudoTime} onSelectedObject={handleObjectSelected} onPseudoTimeChange={handlePseudoTimeChange} onStopTimeChange={(stopTime: number) => setStopTime(stopTime)} onObjectsChange={handleObjectsChange} />
      <Toolbar onToolSelected={(tool: Tool) => setSelectedTool(tool)} />
      <Controlbar time={time} stopTime={stopTime} onPlayPause={(shouldPlay: boolean) => setShouldPlay(shouldPlay)} onTimeChange={handleTimeChange} onShowPaths={(show) => setShouldShowPaths(show)} />
      {selectedObject && (
        <ObjectEditor object={selectedObject} onObjectModified={(obj) => { handleObjectModified(obj); }} />
      )}
    </div>
  );
}

export default App;
