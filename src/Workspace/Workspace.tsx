import React, { FC, useEffect, useReducer, useState } from 'react';
import BattlefieldObj from '../BattlefieldObj/BattlefieldObj';
import { BattlefieldObject, createBattlefieldObject, getStopTime, HeadingDegrees, PathCreationMode, Position, PositionMath, SpeedKnots, update } from '../battlefield-object';
import { Tool } from '../Toolbar/tools';
import './Workspace.css';
import ObjectEditor from './ObjectEditor/ObjectEditor';
import MapBackground from './MapBackground/MapBackground';
import { MapType } from '../battlefield-object-types';

interface WorkspaceProps {
  objects: BattlefieldObject[];
  tool: Tool;
  shouldPlay: boolean;
  shouldShowPaths: boolean;
  time: number;
  pseudoTime: number | null;
  map: MapType;
  onStopTimeChange: (stopTime: number) => void;
  onPseudoTimeChange: (pseudoTime: number | null) => void;
  onObjectsChange: (newObjects: BattlefieldObject[], objectBeingPlaced: BattlefieldObject | null) => void;
}

function getClientPosWithPan(e: React.MouseEvent | MouseEvent, pan: Position): Position {
  return [e.clientX - pan[0], e.clientY - pan[1]];
}

// TODO: Use vector math functions instead of inline calculations
const Workspace: FC<WorkspaceProps> = (props: WorkspaceProps) => {
  const [mousePressed, setMousePressed] = useState<boolean>(false);
  const [objectBeingPlaced, setObjectBeingPlaced] = useState<BattlefieldObject | null>(null);
  const [selectedObject, setSelectedObject] = useState<BattlefieldObject | null>(null);
  const [undoStack, setUndoStack] = useState<{ action: 'delete' | 'recreate', data: any }[]>([]);
  const [pressedPos, setPressedPos] = useState<Position>([0, 0]);
  const [pan, setPan] = useState<Position>([0, 0]);
  const [panOrigin, setPanOrigin] = useState<Position>([0, 0]);

  // TODO: Find out how much forceUpdate is actually needed anymore
  const [, forceUpdate] = useReducer(x => x + 1, 0);

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
      const newObj = createBattlefieldObject(null, "", props.tool.objectType, props.tool.endType ? props.tool.endType : null, clientPosWithPan, 0, props.time, props.tool.speedKnots, 0, '');
      newObj.path.addPoint(clientPosWithPan[0], clientPosWithPan[1]);
      setObjectBeingPlaced(newObj);
      props.onObjectsChange(props.objects, newObj);
    }
    else if (props.tool.toolType === 'placeStatic') {
      const newObj = createBattlefieldObject(null, "", props.tool.objectType, null, clientPosWithPan, 0 as HeadingDegrees, props.time, 0 as SpeedKnots, 0, '');
      setObjectBeingPlaced(newObj);
      props.onObjectsChange(props.objects, newObj);
    }
    else if (props.tool.toolType === 'placeLabel') {
      const newObj = createBattlefieldObject(null, "New", 'label', null, clientPosWithPan, 0 as HeadingDegrees, props.time, 0 as SpeedKnots, 0, '');
      setObjectBeingPlaced(newObj);
      props.onObjectsChange(props.objects, newObj);
    }
    else if (props.tool.toolType === 'placeMeasurement') {
      const newObj = createBattlefieldObject(null, "New", 'measurement', null, clientPosWithPan, 0 as HeadingDegrees, props.time, 0 as SpeedKnots, 0, '');
      setObjectBeingPlaced(newObj);
      newObj.path.addPoint(clientPosWithPan[0], clientPosWithPan[1]);
      newObj.path.addPoint(clientPosWithPan[0], clientPosWithPan[1]);
      props.onObjectsChange(props.objects, newObj);
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
      const newObjects = [...props.objects];
      newObjects.push(objectBeingPlaced);
      setUndoStack([...undoStack, { action: 'delete', data: { id: objectBeingPlaced.id } }]);
      setObjectBeingPlaced(null);
      props.onPseudoTimeChange(null);
      props.onObjectsChange(newObjects, objectBeingPlaced);
      // forceUpdate(); // ???
    }
  }

  const movedMouse = (e: React.MouseEvent) => {
    if (e.buttons === 2) {
      const delta = PositionMath.delta([e.clientX, e.clientY], pressedPos);
      setPan(PositionMath.add(panOrigin, delta));
      e.preventDefault();
    }
    if (mousePressed && objectBeingPlaced) {
      let timeUsed = props.time;

      if (props.tool.toolType === 'placeMovable') {
        let creationMode: PathCreationMode = 'fly_smooth';
        if (e.shiftKey) { creationMode = 'fly_straight'; }
        if (e.ctrlKey || e.metaKey) { creationMode = 'normal'; }
        objectBeingPlaced.path.considerAddingPoint(e.clientX - pan[0], e.clientY - pan[1], creationMode, props.tool.pathSmoothness);
        if (objectBeingPlaced.path.points.length > 0) {
          const startHdg = objectBeingPlaced.path.getHeadingAlongCurveNorm(0);
          objectBeingPlaced.heading = startHdg;
          update(objectBeingPlaced, props.time);
          timeUsed = getStopTime(objectBeingPlaced);
          props.onObjectsChange(props.objects, objectBeingPlaced);
          props.onPseudoTimeChange(timeUsed);
        }
      } else if (props.tool.toolType === 'placeStatic' || props.tool.toolType === 'placeLabel') {
        const dx = e.clientX - pressedPos[0];
        const dy = e.clientY - pressedPos[1];
        const heading = (dx !== 0 || dy !== 0) ? Math.atan2(dy, dx) * (360 / (Math.PI * 2)) + 90 : 0;
        objectBeingPlaced.heading = heading;
        update(objectBeingPlaced, props.time);
        setObjectBeingPlaced({ ...objectBeingPlaced } );
        props.onObjectsChange(props.objects, objectBeingPlaced);
      } else if (props.tool.toolType === 'placeMeasurement') {
        // TODO: Avoid recreating objects
        objectBeingPlaced.path.setPoints([[pressedPos[0] - pan[0], pressedPos[1] - pan[1]], getClientPosWithPan(e, pan)]);
        update(objectBeingPlaced, props.time);
        setObjectBeingPlaced({ ...objectBeingPlaced } );
        props.onObjectsChange(props.objects, objectBeingPlaced);
      }
    }
  }

  const undo = () => {
    if (undoStack.length > 0) {
      const action = undoStack[undoStack.length - 1];
      if (action.action === 'delete') {
        deleteObject(action.data.id, false);
      }
      else if (action.action === 'recreate') {
        const newObjects = [...props.objects, action.data.object];
        props.onObjectsChange(newObjects, objectBeingPlaced); // TODO: Immutability?
      }
      setUndoStack(undoStack.slice(0, undoStack.length - 1));
    }
  }

  const deleteObject = (id: string, undoable=true) => {
    const deletedObject = props.objects.filter((o) => o.id === id)[0];
    const newObjects = props.objects.filter((o) => o.id !== id);
    if (undoable) {
      setUndoStack([...undoStack, { action: 'recreate', data: { object: deletedObject } }]);
    }
    props.onObjectsChange(newObjects, objectBeingPlaced); // TODO: Immutability?
  }

  const clickedObject = (obj: BattlefieldObject) => {
    if(props.tool.toolType === 'delete') {
      deleteObject(obj.id);
    } else if(props.tool.toolType === 'select') {
      setSelectedObject(obj);
    }
  }

  const objectModified = (obj: BattlefieldObject) => {
    props.onObjectsChange(props.objects, objectBeingPlaced); // TODO: Immutability?
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
      // This is an actual true side effect
      if (props.tool.toolType !== 'select') {
        setSelectedObject(null);
      }
  }, [props.tool]);

  const panStyle = {
    transform: `translate(${pan[0]}px, ${pan[1]}px)`,
  }

  return (
    <div className="Workspace"  data-testid="Workspace"
      onMouseDown={(e: React.MouseEvent) => startPressWorkspace(e)}
      onMouseUp={(e: React.MouseEvent) => stopPressWorkspace(e)}
      onMouseMove={(e: React.MouseEvent) => movedMouse(e)}>
      <div className="panner" style={panStyle}>
        <MapBackground map={props.map} />
        {props.objects.map((object) =>
          <BattlefieldObj object={object} onClick={ () => clickedObject(object) } isInactive={false} key={object.id} shouldShowPath={props.shouldShowPaths} time={props.pseudoTime ?? props.time}></BattlefieldObj>
        )
        }
        {objectBeingPlaced && (
          <BattlefieldObj object={objectBeingPlaced} isInactive={true} shouldShowPath={true} time={0} />
        )}

        {selectedObject && (
          <ObjectEditor object={selectedObject} onObjectModified={(obj) => { objectModified(obj); }} />
        )}
        </div>
    </div>
  );
}

export default Workspace;
