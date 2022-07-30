import React, { FC, useEffect, useReducer, useState } from 'react';
import Aircraft from '../Aircraft/Aircraft';
import { BattlefieldObject, createBattlefieldObject, getStopTime, Heading, Position, Speed, update } from '../battlefield-object';
import { loadObjects, serializeObjects } from '../battlefield-object-persister';
import { Tool } from '../Toolbar/Toolbar';
import './Workspace.css';

interface WorkspaceProps {
  tool: Tool;
  shouldPlay: boolean;
  time: number;
  onStopTimeChange: (stopTime: number) => void
}

const Workspace: FC<WorkspaceProps> = (props: WorkspaceProps) => {
  const [objects, setObjects] = useState<BattlefieldObject[]>([]);
  const [mousePressed, setMousePressed] = useState<boolean>(false);
  const [objectBeingPlaced, setObjectBeingPlaced] = useState<BattlefieldObject | null>(null);
  const [undoStack, setUndoStack] = useState<{ action: 'delete', data: any }[]>([]);
  const [pressedPos, setPressedPos] = useState<{x: number, y: number}>({x: 0, y: 0});

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const updateUrl = (newObjects: BattlefieldObject[]) => {
    // TODO: Move this to App or something
    const serialized = serializeObjects(newObjects);
    window.location.hash = serialized;
  }

  const checkStopTime = (newObjects: BattlefieldObject[], extraObject: BattlefieldObject | null = null) => {
    let max = 0;
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

    if (props.tool.toolType === 'placeMovable') {
      const newObj = createBattlefieldObject(null, "", props.tool.objectType, props.tool.endType, new Position(e.clientX, e.clientY), new Heading(0), props.time, Speed.fromKnots(props.tool.speedKnots));
      newObj.path.addPoint(e.clientX, e.clientY);
      setObjectBeingPlaced(newObj);
      checkStopTime(objects, newObj);
    }
    if (props.tool.toolType === 'placeStatic') {
      const newObj = createBattlefieldObject(null, "", props.tool.objectType, null, new Position(e.clientX, e.clientY), new Heading(0), props.time, Speed.fromKnots(0));
      setObjectBeingPlaced(newObj);
      checkStopTime(objects, newObj);
    }
  }

  const stopPressWorkspace = (e: React.MouseEvent) => {
    setMousePressed(false);

    if (objectBeingPlaced) {
      const newObjects = [...objects];
      newObjects.push(objectBeingPlaced);
      setObjects((prevObjects) => [...prevObjects, objectBeingPlaced]);
      setUndoStack([...undoStack, { action: 'delete', data: { id: objectBeingPlaced.id } }]);
      setObjectBeingPlaced(null);
      updateUrl(newObjects);
      checkStopTime(newObjects, objectBeingPlaced);
      forceUpdate();
    }
  }

  const movedMouse = (e: React.MouseEvent) => {
    if (mousePressed && objectBeingPlaced) {

      if (props.tool.toolType === 'placeMovable') {
        objectBeingPlaced.path.considerAddingPoint(e.clientX, e.clientY);
        if (objectBeingPlaced.path.points.length > 0) {
          const startHdg = objectBeingPlaced.path.getHeadingAlongCurveNorm(0);
          objectBeingPlaced.heading.heading = startHdg;
          update(objectBeingPlaced, props.time);
        }
        checkStopTime(objects, objectBeingPlaced);
      } else if (props.tool.toolType === 'placeStatic') {
        const dx = e.clientX - pressedPos.x;
        const dy = e.clientY - pressedPos.y;
        const heading = (dx !== 0 || dy !== 0) ? Math.atan2(dy, dx) * (360 / (Math.PI * 2)) + 90 : 0;
        objectBeingPlaced.heading = new Heading(heading);
        update(objectBeingPlaced, props.time);
        setObjectBeingPlaced({ ...objectBeingPlaced } );
      }
      forceUpdate();
    }
  }

  const clickedWorkspace = (e: React.MouseEvent) => {
    // TODO: Differentiate between unit creation tools and other tools
  }

  const undo = () => {
    if (undoStack.length > 0) {
      const action = undoStack[undoStack.length - 1];
      if (action.action === 'delete') {
        const newObjects = objects.filter((o) => o.id !== action.data.id);
        setObjects(newObjects);
        updateUrl(newObjects);
        checkStopTime(newObjects, objectBeingPlaced);
      }
      setUndoStack(undoStack.slice(0, undoStack.length - 1));
    }
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
    objects.forEach((obj) => {
      update(obj, props.time);
    });
  }, [objects, props.time]);


  useEffect(() => {
    // Load initial objects
    if (window.location.hash.length > 0) {
      const loadedObjects = loadObjects(window.location.hash);
      console.log("Initial objects", loadedObjects);
      loadedObjects.forEach((obj) => {
        update(obj, 0);
      });
      setObjects(loadedObjects);
      checkStopTime(loadedObjects);
    }
  }, []);

  return (
    <div className="Workspace" data-testid="Workspace"
      onMouseDown={(e: React.MouseEvent) => startPressWorkspace(e)}
      onMouseUp={(e: React.MouseEvent) => stopPressWorkspace(e)}
      onMouseMove={(e: React.MouseEvent) => movedMouse(e)}
      onClick={(e: React.MouseEvent) => clickedWorkspace(e)}>
      {objects.map((object) =>
        <Aircraft object={object} isInactive={false} key={object.id} shouldShowPath={!props.shouldPlay}></Aircraft>
      )
      }
      {objectBeingPlaced && (
        <Aircraft object={objectBeingPlaced} isInactive={true} shouldShowPath={true}></Aircraft>
      )}
    </div>
  );
}

export default Workspace;
