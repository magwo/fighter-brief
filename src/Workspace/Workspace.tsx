import React, { FC, useEffect, useReducer, useState } from 'react';
import BattlefieldObj from '../BattlefieldObj/BattlefieldObj';
import { BattlefieldObject, createBattlefieldObject, getStopTime, Heading, Position, Speed, update } from '../battlefield-object';
import { loadObjects, serializeObjects } from '../battlefield-object-persister';
import { Tool } from '../Toolbar/tools';
import './Workspace.css';
import ObjectEditor from './ObjectEditor/ObjectEditor';

interface WorkspaceProps {
  tool: Tool;
  shouldPlay: boolean;
  time: number;
  onStopTimeChange: (stopTime: number) => void
}

function updateAllObjects(objects: BattlefieldObject[], time: number) {
  objects.forEach((obj) => {
    update(obj, time);
  });
}

const Workspace: FC<WorkspaceProps> = (props: WorkspaceProps) => {
  const [time, setTime] = useState<number>(0);
  const [pseudoTime, setPseudoTime] = useState<number | null>(null);
  const [objects, setObjects] = useState<BattlefieldObject[]>([]);
  const [mousePressed, setMousePressed] = useState<boolean>(false);
  const [objectBeingPlaced, setObjectBeingPlaced] = useState<BattlefieldObject | null>(null);
  const [selectedObject, setSelectedObject] = useState<BattlefieldObject | null>(null);
  const [undoStack, setUndoStack] = useState<{ action: 'delete' | 'recreate', data: any }[]>([]);
  const [pressedPos, setPressedPos] = useState<{x: number, y: number}>({x: 0, y: 0});

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const updateUrl = (newObjects: BattlefieldObject[]) => {
    // TODO: Move this to App or something
    const serialized = serializeObjects(newObjects);
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
    setPressedPos({x: e.clientX, y: e.clientY});

    if (selectedObject) {
      setSelectedObject(null);
    }

    if (props.tool.toolType === 'placeMovable') {
      const newObj = createBattlefieldObject(null, "", props.tool.objectType, props.tool.endType ? props.tool.endType : null, new Position(e.clientX, e.clientY), new Heading(0), time, Speed.fromKnots(props.tool.speedKnots));
      newObj.path.addPoint(e.clientX, e.clientY);
      setObjectBeingPlaced(newObj);
      checkStopTime(objects, newObj);
    }
    else if (props.tool.toolType === 'placeStatic') {
      const newObj = createBattlefieldObject(null, "", props.tool.objectType, null, new Position(e.clientX, e.clientY), new Heading(0), time, Speed.fromKnots(0));
      setObjectBeingPlaced(newObj);
      checkStopTime(objects, newObj);
    }
    else if (props.tool.toolType === 'placeLabel') {
      const newObj = createBattlefieldObject(null, "New", 'label', null, new Position(e.clientX, e.clientY), new Heading(0), time, Speed.fromKnots(0));
      setObjectBeingPlaced(newObj);
      checkStopTime(objects, newObj);
    }
    else if (props.tool.toolType === 'placeMeasurement') {
      const newObj = createBattlefieldObject(null, "New", 'measurement', null, new Position(e.clientX, e.clientY), new Heading(0), time, Speed.fromKnots(0));
      setObjectBeingPlaced(newObj);
      newObj.path.addPoint(e.clientX, e.clientY);
      newObj.path.addPoint(e.clientX, e.clientY);
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
    if (mousePressed && objectBeingPlaced) {
      let timeUsed = time;

      if (props.tool.toolType === 'placeMovable') {
        objectBeingPlaced.path.considerAddingPoint(e.clientX, e.clientY);
        if (objectBeingPlaced.path.points.length > 0) {
          const startHdg = objectBeingPlaced.path.getHeadingAlongCurveNorm(0);
          objectBeingPlaced.heading.heading = startHdg;
          update(objectBeingPlaced, time);
          timeUsed = getStopTime(objectBeingPlaced);
          setPseudoTime(timeUsed);
        }
        checkStopTime(objects, objectBeingPlaced);
      } else if (props.tool.toolType === 'placeStatic' || props.tool.toolType === 'placeLabel') {
        const dx = e.clientX - pressedPos.x;
        const dy = e.clientY - pressedPos.y;
        const heading = (dx !== 0 || dy !== 0) ? Math.atan2(dy, dx) * (360 / (Math.PI * 2)) + 90 : 0;
        objectBeingPlaced.heading = new Heading(heading);
        update(objectBeingPlaced, time);
        setObjectBeingPlaced({ ...objectBeingPlaced } );
      } else if (props.tool.toolType === 'placeMeasurement') {
        // TODO: Avoid recreating objects
        objectBeingPlaced.path.setPoints([new Position(pressedPos.x, pressedPos.y), new Position(e.clientX, e.clientY)]);
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
      const loadedObjects = loadObjects(window.location.hash);
      console.log("Initial objects", loadedObjects);
      updateAllObjects(loadedObjects, 0);
      setObjects(loadedObjects);
      checkStopTime(loadedObjects);
    }
  }, []);

  return (
    <div className="Workspace" data-testid="Workspace"
      onMouseDown={(e: React.MouseEvent) => startPressWorkspace(e)}
      onMouseUp={(e: React.MouseEvent) => stopPressWorkspace(e)}
      onMouseMove={(e: React.MouseEvent) => movedMouse(e)}>
      {objects.map((object) =>
        <BattlefieldObj object={object} onClick={ () => clickedObject(object) } isInactive={false} key={object.id} shouldShowPath={!props.shouldPlay}></BattlefieldObj>
      )
      }
      {objectBeingPlaced && (
        <BattlefieldObj object={objectBeingPlaced} isInactive={true} shouldShowPath={true} />
      )}

      {selectedObject && (
        <ObjectEditor object={selectedObject} onObjectModified={(obj) => { objectModified(obj); }} />
      )}
    </div>
  );
}

export default Workspace;
