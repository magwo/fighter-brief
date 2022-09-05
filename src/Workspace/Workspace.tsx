import React, { FC, useEffect, useState } from 'react';
import BattlefieldObj from '../BattlefieldObj/BattlefieldObj';
import { BattlefieldObject, createBattlefieldObject, getStopTime, HeadingDegrees, PathCreationMode, Position, PositionMath, SpeedKnots, update } from '../battlefield-object';
import { Tool } from '../Toolbar/tools';
import './Workspace.css';
import MapBackground from './MapBackground/MapBackground';
import { CoalitionType, MapType } from '../battlefield-object-types';

interface WorkspaceProps {
  objects: BattlefieldObject[];
  selectedObject: BattlefieldObject | null;
  tool: Tool;
  shouldPlay: boolean;
  shouldShowPaths: boolean;
  time: number;
  pseudoTime: number | null;
  map: MapType;
  onStopTimeChange: (stopTime: number) => void;
  onPseudoTimeChange: (pseudoTime: number | null) => void;
  onSelectedObject: (object: BattlefieldObject | null) => void;
  onObjectsChange: (newObjects: BattlefieldObject[], objectBeingPlaced: BattlefieldObject | null, state: 'FINAL' | 'NOT_FINAL') => void;
}

function getWorldPosWithPanAndZoom(viewportX: number, viewportY: number, pan: Position, zoomLevel: number): Position {
  const result: Position = [(viewportX + pan[0]) / zoomLevel, (viewportY + pan[1]) / zoomLevel];
  return result;
}

// TODO: Use use-gesture lib instead https://use-gesture.netlify.app/docs/
// TODO: Use vector math functions instead of inline calculations
const Workspace: FC<WorkspaceProps> = (props: WorkspaceProps) => {
  const [pointerPressed, setPointerPressed] = useState<boolean>(false);
  const [objectBeingPlaced, setObjectBeingPlaced] = useState<BattlefieldObject | null>(null);
  const [undoStack, setUndoStack] = useState<{ action: 'delete' | 'recreate', data: any }[]>([]);
  const [pressedPos, setPressedPos] = useState<Position>([0, 0]);
  const [pan, setPan] = useState<Position>([0, 0]);
  const [panOrigin, setPanOrigin] = useState<Position>([0, 0]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const startPressWorkspace = (e: React.PointerEvent) => {
    setPointerPressed(true);
    setPressedPos([e.clientX, e.clientY]);

    if (e.buttons === 2) {
      setPanOrigin(pan);
      return;
    }

    if (props.selectedObject) {
      props.onSelectedObject(null);
    }

    const clientPosWithPan = getWorldPosWithPanAndZoom(e.clientX, e.clientY, pan, zoomLevel);
    if (props.tool.toolType === 'placeMovable') {
      const newObj = createBattlefieldObject(null, "", '' as CoalitionType, props.tool.objectType, props.tool.endType ? props.tool.endType : null, clientPosWithPan, 0, props.time, props.tool.speedKnots, 0, '');
      newObj.path.addPoint(clientPosWithPan[0], clientPosWithPan[1]);
      setObjectBeingPlaced(newObj);
      props.onObjectsChange(props.objects, newObj, 'NOT_FINAL');
    }
    else if (props.tool.toolType === 'placeStatic') {
      const newObj = createBattlefieldObject(null, "", '' as CoalitionType, props.tool.objectType, null, clientPosWithPan, 0 as HeadingDegrees, props.time, 0 as SpeedKnots, 0, '');
      setObjectBeingPlaced(newObj);
      props.onObjectsChange(props.objects, newObj, 'NOT_FINAL');
    }
    else if (props.tool.toolType === 'placeLabel') {
      const newObj = createBattlefieldObject(null, "New", '' as CoalitionType, 'label', null, clientPosWithPan, 0 as HeadingDegrees, props.time, 0 as SpeedKnots, 0, '');
      setObjectBeingPlaced(newObj);
      props.onObjectsChange(props.objects, newObj, 'NOT_FINAL');
    }
    else if (props.tool.toolType === 'placeMeasurement') {
      const newObj = createBattlefieldObject(null, '', '' as CoalitionType, props.tool.subType, null, clientPosWithPan, 0 as HeadingDegrees, props.time, 0 as SpeedKnots, 0, '');
      setObjectBeingPlaced(newObj);
      newObj.path.addPoint(clientPosWithPan[0], clientPosWithPan[1]);
      newObj.path.addPoint(clientPosWithPan[0], clientPosWithPan[1]);
      props.onObjectsChange(props.objects, newObj, 'NOT_FINAL');
    }
  }

  const stopPressWorkspace = (e: React.PointerEvent) => {
    setPointerPressed(false);

    if (objectBeingPlaced) {
      let abort = false;
      if (props.tool.toolType === 'placeLabel' || (props.tool.toolType === 'placeMeasurement' && props.tool.subType !== 'line')) {
        const name = prompt("Enter text", objectBeingPlaced.name);
        if (name !== null) {
          objectBeingPlaced.name = name;
        } else {
          abort = true;
        }
      }
      const newObjects = [...props.objects];
      if (!abort) {
        newObjects.push(objectBeingPlaced);
        setUndoStack([...undoStack, { action: 'delete', data: { id: objectBeingPlaced.id } }]);
      }
      setObjectBeingPlaced(null);
      props.onPseudoTimeChange(null);
      props.onObjectsChange(newObjects, objectBeingPlaced, 'FINAL');
    }
  }

  const movedPointer = (e: React.PointerEvent) => {
    if (e.buttons === 2) {
      const delta = PositionMath.delta([e.clientX, e.clientY], pressedPos);
      setPan(PositionMath.delta(panOrigin, delta));
      e.preventDefault();
    }
    if (pointerPressed && objectBeingPlaced) {
      let timeUsed = props.time;

      if (props.tool.toolType === 'placeMovable') {
        let creationMode: PathCreationMode = 'fly_smooth';
        if (e.shiftKey) { creationMode = 'fly_straight'; }
        if (e.ctrlKey || e.metaKey) { creationMode = 'normal'; }
        const newPoint = getWorldPosWithPanAndZoom(e.clientX, e.clientY, pan, zoomLevel);
        objectBeingPlaced.path.considerAddingPoint(newPoint[0], newPoint[1], creationMode, props.tool.pathSmoothness);
        if (objectBeingPlaced.path.points.length > 0) {
          const startHdg = objectBeingPlaced.path.getHeadingAlongCurveNorm(0);
          objectBeingPlaced.heading = startHdg;
          update(objectBeingPlaced, props.time);
          timeUsed = getStopTime(objectBeingPlaced);
          props.onObjectsChange(props.objects, objectBeingPlaced, 'NOT_FINAL');
          props.onPseudoTimeChange(timeUsed);
        }
      } else if (props.tool.toolType === 'placeStatic' || props.tool.toolType === 'placeLabel') {
        const dx = e.clientX - pressedPos[0];
        const dy = e.clientY - pressedPos[1];
        const heading = (dx !== 0 || dy !== 0) ? Math.atan2(dy, dx) * (360 / (Math.PI * 2)) + 90 : 0;
        objectBeingPlaced.heading = heading;
        update(objectBeingPlaced, props.time);
        setObjectBeingPlaced({ ...objectBeingPlaced } );
        props.onObjectsChange(props.objects, objectBeingPlaced, 'NOT_FINAL');
      } else if (props.tool.toolType === 'placeMeasurement') {
        // TODO: Avoid recreating objects

        const p1: Position = getWorldPosWithPanAndZoom(pressedPos[0], pressedPos[1], pan, zoomLevel);
        const p2 = getWorldPosWithPanAndZoom(e.clientX, e.clientY, pan, zoomLevel);
        if (props.tool.subType !== 'line') {
          objectBeingPlaced.name = `${Math.round(PositionMath.getDistanceNm(p1, p2))} NM`;
        }
        objectBeingPlaced.path.setPoints([p1, p2]);
        update(objectBeingPlaced, props.time);
        setObjectBeingPlaced({ ...objectBeingPlaced } );
        props.onObjectsChange(props.objects, objectBeingPlaced, 'NOT_FINAL');
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
        props.onObjectsChange(newObjects, objectBeingPlaced, 'FINAL'); // TODO: Immutability?
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
    props.onObjectsChange(newObjects, objectBeingPlaced, 'FINAL'); // TODO: Immutability?
  }

  const clickedObject = (obj: BattlefieldObject) => {
    if(props.tool.toolType === 'delete') {
      deleteObject(obj.id);
    } else if(props.tool.toolType === 'select') {
      props.onSelectedObject(obj);
    }
  }

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "z" && (e.getModifierState("Control") || e.getModifierState(("Meta")))) {
      undo();
    } else if ((e.key === "Backspace" || e.key === "Delete") && props.selectedObject !== null) {
      deleteObject(props.selectedObject.id);
      props.onSelectedObject(null);
    }
  }

  const handleWheel = (event: React.WheelEvent) => {
    // TODO: Use a center point
    setZoomLevel((currentZoomLevel) => {
      const prevZoom = currentZoomLevel;
      currentZoomLevel -= event.deltaY / 300;
      currentZoomLevel = Math.max(0.5, Math.min(2.0, currentZoomLevel));
      const ratio = 1 - currentZoomLevel / prevZoom;
      setPan([pan[0] + (-event.clientX - pan[0]) * ratio, pan[1] + (-event.clientY - pan[1]) * ratio]);
      return currentZoomLevel;
    });
  };


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
        props.onSelectedObject(null);
      }
  }, [props.tool]);

  const panStyle = {
    transform: `translate(${-pan[0]}px, ${-pan[1]}px) scale(${zoomLevel})`,
  }

  return (
    <div className="Workspace"  data-testid="Workspace"
      onPointerDown={(e: React.PointerEvent) => startPressWorkspace(e)}
      onPointerUp={(e: React.PointerEvent) => stopPressWorkspace(e)}
      onPointerMove={(e: React.PointerEvent) => movedPointer(e)}
      onWheel={(e: React.WheelEvent) => handleWheel(e) }>
      
      <div className="panner" style={panStyle}>
        <MapBackground map={props.map} />
        {props.objects.map((object) =>
          <BattlefieldObj object={object} onClick={ () => clickedObject(object) } isSelected={props.selectedObject?.id === object.id} isInactive={false} key={object.id} shouldShowPath={props.shouldShowPaths} time={props.pseudoTime ?? props.time}></BattlefieldObj>
        )
        }
        {objectBeingPlaced && (
          <BattlefieldObj object={objectBeingPlaced} isSelected={false} isInactive={true} shouldShowPath={true} time={0} />
        )}
        </div>
    </div>
  );
}

export default Workspace;
