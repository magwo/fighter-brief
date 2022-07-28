import React, { FC, useReducer, useState } from 'react';
import Aircraft from '../Aircraft/Aircraft';
import { BattlefieldObject, Heading, Position, Speed } from '../battlefield-object';
import { AircraftType } from '../battlefield-object-types';
import useAnimationFrame from '../useAnimationFrame';
import './Workspace.css';

interface WorkspaceProps {
  activeTool: string;
  shouldPlay: boolean;
}

const Workspace: FC<WorkspaceProps> = (props: WorkspaceProps) => {
  const [time, setTime] = useState<number>(0);
  const [objects, setObjects] = useState<BattlefieldObject[]>([]);
  const [mousePressed, setMousePressed] = useState<boolean>(false);
  const [objectBeingPlaced, setObjectBeingPlaced] = useState<BattlefieldObject | null>(null);

  const [pressed, setPressed] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

  const startPressWorkspace = (e: React.MouseEvent) => {
    setMousePressed(true);
    setPressed({ x: e.clientX, y: e.clientY });

    if (props.activeTool !== '') {
      const newObj = new BattlefieldObject("", props.activeTool as AircraftType, new Position(e.clientX, e.clientY), new Heading(0), new Speed(0));
      newObj.path.addPoint(e.clientX, e.clientY);
      setObjectBeingPlaced(newObj);
    }
  }

  const stopPressWorkspace = (e: React.MouseEvent) => {
    setMousePressed(false);
    // TODO: Create from beingPlaced

    if (objectBeingPlaced) {
      const newObjects = [...objects];
      newObjects.push(objectBeingPlaced);
      setObjects(newObjects);
      setObjectBeingPlaced(null);
    }
  }

  const movedMouse = (e: React.MouseEvent) => {
    if (mousePressed && objectBeingPlaced) {
      const dx = e.clientX - pressed.x;
      const dy = e.clientY - pressed.y;
      const heading = (dx !== 0 || dy !== 0) ? Math.atan2(dy, dx) * (360 / (Math.PI * 2)) + 90 : 0;
      const speed = 0.6 * Math.sqrt(dx * dx + dy * dy);

      objectBeingPlaced.path.considerAddingPoint(e.clientX, e.clientY);

      objectBeingPlaced.heading.heading = heading;
      objectBeingPlaced.speed.metersPerSecond = speed;
    }
  }

  const clickedWorkspace = (e: React.MouseEvent) => {
    // TODO: Differentiate between unit creation tools and other tools
  }

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  // TODO: Put this in Controlbar emit time, and instead put useEffect here
  useAnimationFrame((_time: { time: number; delta: number }) => {
    const timeDelta = props.shouldPlay ? _time.delta : 0;
    const newTime = time + timeDelta;
    objects.forEach((obj) => {
      obj.update(timeDelta, newTime);
      setTime(newTime);
    });
    forceUpdate();
  });

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
