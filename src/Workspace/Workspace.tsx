import React, { FC, useEffect, useReducer, useState } from 'react';
import BattlefieldObj from '../BattlefieldObj/BattlefieldObj';
import { BattlefieldObject, createBattlefieldObject, getStopTime, HeadingDegrees, PathCreationMode, Position, PositionMath, SpeedKnots, update } from '../battlefield-object';
import { loadData, serializeData } from '../battlefield-object-persister';
import { Tool } from '../Toolbar/tools';
import './Workspace.css';
import ObjectEditor from './ObjectEditor/ObjectEditor';

interface WorkspaceProps {
  tool: Tool;
  shouldPlay: boolean;
  shouldShowPaths: boolean;
  time: number;
  onStopTimeChange: (stopTime: number) => void
}

function updateAllObjects(objects: BattlefieldObject[], time: number) {
  objects.forEach((obj) => {
    update(obj, time);
  });
}

function getClientPosWithPan(e: React.MouseEvent | MouseEvent, pan: Position): Position {
  return [e.clientX - pan[0], e.clientY - pan[1]];
}

const Workspace: FC<WorkspaceProps> = (props: WorkspaceProps) => {
  const [time, setTime] = useState<number>(0);
  const [pseudoTime, setPseudoTime] = useState<number | null>(null);
  const [objects, setObjects] = useState<BattlefieldObject[]>([]);
  const [mousePressed, setMousePressed] = useState<boolean>(false);
  const [objectBeingPlaced, setObjectBeingPlaced] = useState<BattlefieldObject | null>(null);
  const [selectedObject, setSelectedObject] = useState<BattlefieldObject | null>(null);
  const [undoStack, setUndoStack] = useState<{ action: 'delete' | 'recreate', data: any }[]>([]);
  const [pressedPos, setPressedPos] = useState<Position>([0, 0]);
  const [pan, setPan] = useState<Position>([0, 0]);
  const [panOrigin, setPanOrigin] = useState<Position>([0, 0]);

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const updateUrl = (newObjects: BattlefieldObject[]) => {
    // TODO: Move this to App or something
    const serialized = serializeData(newObjects);
    window.location.hash = serialized;
  }

  const checkStopTime = (newObjects: BattlefieldObject[], extraObject: BattlefieldObject | null = null) => {
    let max = 1;
    newObjects.forEach((obj) => {
      max = Math.max(max, getStopTime(obj));
    });
    if (extraObject !== null) {
      max = Math.max(max, getStopTime(extraObject));
    }
    props.onStopTimeChange(max);
  }

  const startPressWorkspace = (e: React.MouseEvent) => {
    setMousePressed(true);
    setPressedPos([e.clientX, e.clientY]);

    if (selectedObject) {
      setSelectedObject(null);
    }

    if (e.buttons === 2) {
      setPanOrigin(pan);
      return;
    }

    const clientPosWithPan = getClientPosWithPan(e, pan);
    if (props.tool.toolType === 'placeMovable') {
      const newObj = createBattlefieldObject(null, "", props.tool.objectType, props.tool.endType ? props.tool.endType : null, clientPosWithPan, 0, time, props.tool.speedKnots);
      newObj.path.addPoint(clientPosWithPan[0], clientPosWithPan[1]);
      setObjectBeingPlaced(newObj);
      checkStopTime(objects, newObj);
    }
    else if (props.tool.toolType === 'placeStatic') {
      const newObj = createBattlefieldObject(null, "", props.tool.objectType, null, clientPosWithPan, 0 as HeadingDegrees, time, 0 as SpeedKnots);
      setObjectBeingPlaced(newObj);
      checkStopTime(objects, newObj);
    }
    else if (props.tool.toolType === 'placeLabel') {
      const newObj = createBattlefieldObject(null, "New", 'label', null, clientPosWithPan, 0 as HeadingDegrees, time, 0 as SpeedKnots);
      setObjectBeingPlaced(newObj);
      checkStopTime(objects, newObj);
    }
    else if (props.tool.toolType === 'placeMeasurement') {
      const newObj = createBattlefieldObject(null, "New", 'measurement', null, clientPosWithPan, 0 as HeadingDegrees, time, 0 as SpeedKnots);
      setObjectBeingPlaced(newObj);
      newObj.path.addPoint(clientPosWithPan[0], clientPosWithPan[1]);
      newObj.path.addPoint(clientPosWithPan[0], clientPosWithPan[1]);
      checkStopTime(objects, newObj);
    }
  }

  const stopPressWorkspace = (e: React.MouseEvent) => {
    setMousePressed(false);

    if (objectBeingPlaced) {
      if (props.tool.toolType === 'placeLabel' || props.tool.toolType === 'placeMeasurement') {
        const name = prompt("Enter text", objectBeingPlaced.name);
        if (name) {
          objectBeingPlaced.name = name;
        }
      }
      const newObjects = [...objects];
      newObjects.push(objectBeingPlaced);
      setObjects((prevObjects) => [...prevObjects, objectBeingPlaced]);
      setUndoStack([...undoStack, { action: 'delete', data: { id: objectBeingPlaced.id } }]);
      setObjectBeingPlaced(null);
      setPseudoTime(null);
      updateAllObjects(newObjects, time);
      updateUrl(newObjects);
      checkStopTime(newObjects, objectBeingPlaced);
      forceUpdate();
    }
  }

  const movedMouse = (e: React.MouseEvent) => {
    if (e.buttons === 2) {
      const delta = PositionMath.delta([e.clientX, e.clientY], pressedPos);
      setPan(PositionMath.add(panOrigin, delta));
      e.preventDefault();
    }
    if (mousePressed && objectBeingPlaced) {
      let timeUsed = time;

      if (props.tool.toolType === 'placeMovable') {
        let creationMode: PathCreationMode = 'fly_smooth';
        if (e.shiftKey) { creationMode = 'fly_straight'; }
        if (e.ctrlKey || e.metaKey) { creationMode = 'normal'; }
        objectBeingPlaced.path.considerAddingPoint(e.clientX - pan[0], e.clientY - pan[1], creationMode, props.tool.pathSmoothness);
        if (objectBeingPlaced.path.points.length > 0) {
          const startHdg = objectBeingPlaced.path.getHeadingAlongCurveNorm(0);
          objectBeingPlaced.heading = startHdg;
          update(objectBeingPlaced, time);
          timeUsed = getStopTime(objectBeingPlaced);
          setPseudoTime(timeUsed);
        }
        checkStopTime(objects, objectBeingPlaced);
      } else if (props.tool.toolType === 'placeStatic' || props.tool.toolType === 'placeLabel') {
        const dx = e.clientX - pressedPos[0];
        const dy = e.clientY - pressedPos[1];
        const heading = (dx !== 0 || dy !== 0) ? Math.atan2(dy, dx) * (360 / (Math.PI * 2)) + 90 : 0;
        objectBeingPlaced.heading = heading;
        update(objectBeingPlaced, time);
        setObjectBeingPlaced({ ...objectBeingPlaced } );
      } else if (props.tool.toolType === 'placeMeasurement') {
        // TODO: Avoid recreating objects
        objectBeingPlaced.path.setPoints([[pressedPos[0] - pan[0], pressedPos[1] - pan[1]], getClientPosWithPan(e, pan)]);
        update(objectBeingPlaced, time);
        setObjectBeingPlaced({ ...objectBeingPlaced } );
      }
      updateAllObjects(objects, timeUsed);
      forceUpdate();
    }
  }

  const undo = () => {
    if (undoStack.length > 0) {
      const action = undoStack[undoStack.length - 1];
      if (action.action === 'delete') {
        deleteObject(action.data.id, false);
      }
      else if (action.action === 'recreate') {
        const newObjects = [...objects, action.data.object];
        setObjects(newObjects);
        updateUrl(newObjects);
        checkStopTime(newObjects, objectBeingPlaced);
      }
      setUndoStack(undoStack.slice(0, undoStack.length - 1));
    }
  }

  const deleteObject = (id: string, undoable=true) => {
    const deletedObject = objects.filter((o) => o.id === id)[0];
    const newObjects = objects.filter((o) => o.id !== id);
    if (undoable) {
      setUndoStack([...undoStack, { action: 'recreate', data: { object: deletedObject } }]);
    }
    setObjects(newObjects);
    updateAllObjects(newObjects, time);
    updateUrl(newObjects);
    checkStopTime(newObjects, objectBeingPlaced);
  }

  const clickedObject = (obj: BattlefieldObject) => {
    if(props.tool.toolType === 'delete') {
      deleteObject(obj.id);
    } else if(props.tool.toolType === 'select') {
      setSelectedObject(obj);
    }
  }

  const objectModified = (obj: BattlefieldObject) => {
    updateAllObjects(objects, time);
    forceUpdate();
    updateUrl(objects);
  }

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "z" && (e.getModifierState("Control") || e.getModifierState(("Meta")))) {
      undo();
    }
  }

  useEffect(() => {
    // Setup global keypress handler
    window.document.addEventListener("keydown", handleKeydown);
    return () => {
      window.document.removeEventListener('keydown', handleKeydown);
    }
  }, [handleKeydown]);

  useEffect(() => {
    // Update objects
    if (pseudoTime !== null) {
      updateAllObjects(objects, pseudoTime);
    } else {
      const newTime = props.time;
      setTime(newTime);
      updateAllObjects(objects, newTime);
    }
  }, [objects, pseudoTime, props.time]);

  useEffect(() => {
      if (props.tool.toolType !== 'select') {
        setSelectedObject(null);
      }
  }, [props.tool]);


  useEffect(() => {
    // Load initial objects
    if (window.location.hash.length > 0) {
      const { scenarioName, loadedObjects } = loadData(window.location.hash);
      console.log("Scenario name is", scenarioName);
      console.log("Initial objects", loadedObjects);
      updateAllObjects(loadedObjects, 0);
      setObjects(loadedObjects);
      checkStopTime(loadedObjects);
    }
  }, []);

  const panStyle = {
    transform: `translate(${pan[0]}px, ${pan[1]}px)`,
  }

  return (
    <div className="Workspace"  data-testid="Workspace"
      onMouseDown={(e: React.MouseEvent) => startPressWorkspace(e)}
      onMouseUp={(e: React.MouseEvent) => stopPressWorkspace(e)}
      onMouseMove={(e: React.MouseEvent) => movedMouse(e)}>
      <div className="panner" style={panStyle}>
        {objects.map((object) =>
          <BattlefieldObj object={object} onClick={ () => clickedObject(object) } isInactive={false} key={object.id} shouldShowPath={props.shouldShowPaths}></BattlefieldObj>
        )
        }
        {objectBeingPlaced && (
          <BattlefieldObj object={objectBeingPlaced} isInactive={true} shouldShowPath={true} />
        )}

        {selectedObject && (
          <ObjectEditor object={selectedObject} onObjectModified={(obj) => { objectModified(obj); }} />
        )}
        </div>
    </div>
  );
}

export default Workspace;
