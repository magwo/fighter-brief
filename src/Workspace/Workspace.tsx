import React, { FC, useEffect, useReducer, useState } from 'react';
import Aircraft from '../Aircraft/Aircraft';
import { BattlefieldObject, Heading, Position, Speed } from '../battlefield-object';
import { loadObjects, serializeObjects } from '../battlefield-object-persister';
import { AircraftType } from '../battlefield-object-types';
import './Workspace.css';

interface WorkspaceProps {
  activeTool: string;
  shouldPlay: boolean;
  timeDelta: number;
  time: number;
  onStopTimeChange: (stopTime: number) => void
}

const Workspace: FC<WorkspaceProps> = (props: WorkspaceProps) => {
  const [objects, setObjects] = useState<BattlefieldObject[]>([]);
  const [mousePressed, setMousePressed] = useState<boolean>(false);
  const [objectBeingPlaced, setObjectBeingPlaced] = useState<BattlefieldObject | null>(null);
  const [undoStack, setUndoStack] = useState<{ action: 'delete', data: any }[]>([]);

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const updateUrl = (newObjects: BattlefieldObject[]) => {
    // TODO: Move this to App or something
    const serialized = serializeObjects(newObjects);
    window.location.hash = serialized;
  }

  const checkStopTime = (newObjects: BattlefieldObject[], extraObject: BattlefieldObject | null = null) => {
    let max = 0;
    newObjects.forEach((obj) => {
      max = Math.max(max, obj.getStopTime());
    });
    if (extraObject !== null) {
      max = Math.max(max, extraObject.getStopTime());
    }
    props.onStopTimeChange(max);
  }

  const startPressWorkspace = (e: React.MouseEvent) => {
    setMousePressed(true);

    if (props.activeTool !== '') {
      const newObj = new BattlefieldObject(null, "", props.activeTool as AircraftType, new Position(e.clientX, e.clientY), new Heading(0), props.time, Speed.fromKnots(400));
      newObj.path.addPoint(e.clientX, e.clientY);
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
    }
  }

  const movedMouse = (e: React.MouseEvent) => {
    if (mousePressed && objectBeingPlaced) {
      // const dx = e.clientX - pressed.x;
      // const dy = e.clientY - pressed.y;
      // const heading = (dx !== 0 || dy !== 0) ? Math.atan2(dy, dx) * (360 / (Math.PI * 2)) + 90 : 0;

      objectBeingPlaced.path.considerAddingPoint(e.clientX, e.clientY);
      if (objectBeingPlaced.path.points.length > 0) {
        const startHdg = objectBeingPlaced.path.getHeadingAlongCurveNorm(0);
        objectBeingPlaced.heading.heading = startHdg;
      }
      checkStopTime(objects, objectBeingPlaced);
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
      obj.update(props.timeDelta, props.time);
    });
  });


  useEffect(() => {
    // Load initial objects
    if (window.location.hash.length > 0) {
      const loadedObjects = loadObjects(window.location.hash);
      console.log("Initial objects", loadedObjects);
      loadedObjects.forEach((obj) => {
        obj.update(0, 0);
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
