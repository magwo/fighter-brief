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
  const [objects, setObjects] = useState<BattlefieldObject[]>([]);
  const [objectBeingPlaced, setObjectBeingPlaced] = useState<BattlefieldObject | null>(null);

  const [pressed, setPresed] = useState<{x: number, y: number}>({x: 0, y: 0});

  const pressedWorkspace = (e: React.MouseEvent) => {
    setPresed({x: e.clientX, y: e.clientY});
  }

  // TODO: Move handler

  const clickedWorkspace = (e: React.MouseEvent) => {
    // TODO: Differentiate between unit creation tools and other tools
    const dx = e.clientX - pressed.x;
    const dy = e.clientY - pressed.y;
    const heading = (dx !== 0 || dy !== 0) ? Math.atan2(dy, dx) * (360/(Math.PI*2)) + 90 : 0;
    const speed = 0.6 * Math.sqrt(dx * dx + dy * dy);
    if (props.activeTool !== '') {
      const newObj = new BattlefieldObject("", props.activeTool as AircraftType, new Position(pressed.x, pressed.y), new Heading(heading), new Speed(speed));
      const newObjects = [...objects];
      newObjects.push(newObj);
      setObjects(newObjects);
    }
  }

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  useAnimationFrame((time: { time: number; delta: number }) => {
    objects.forEach((obj) => {
      if (props.shouldPlay) {
        obj.update(time.delta);
      }
    });
    forceUpdate();
  });

  return (
    <div className="Workspace" data-testid="Workspace"
      onMouseDown={(e: React.MouseEvent) => pressedWorkspace(e)}
      onClick={(e: React.MouseEvent) => clickedWorkspace(e)}>
      {objects.map((object) =>
          <Aircraft object={object} key={object.id}></Aircraft>
        )
      }
      {objectBeingPlaced && (
        <Aircraft object={objectBeingPlaced}></Aircraft>
      )}
    </div>
  );
}

export default Workspace;
