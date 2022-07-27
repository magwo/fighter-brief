import React, { FC, useState } from 'react';
import Aircraft from '../Aircraft/Aircraft';
import { BattlefieldObject, Heading, Position, Speed } from '../battlefield-object';
import { AircraftType } from '../battlefield-object-types';
import './Workspace.css';

interface WorkspaceProps {
  activeTool: string;
}

const Workspace: FC<WorkspaceProps> = (props: WorkspaceProps) => {
  const [objects, setObjects] = useState<BattlefieldObject[]>([]);

  const clickedWorkspace = (e: React.MouseEvent) => {
    // TODO: Differentiate between unit creation tools and other tools
    if (props.activeTool !== '') {
      const newObj = new BattlefieldObject("", props.activeTool as AircraftType, new Position(e.clientX, e.clientY), new Heading(90), new Speed(0));
      const newObjects = ([...objects]);
      newObjects.push(newObj);
      setObjects(newObjects);
    }
  }

  return (
    <div className="Workspace" data-testid="Workspace"
      onClick={(e: React.MouseEvent) => clickedWorkspace(e)}>
      {objects.map((object) =>
          <Aircraft object={object} key={object.id}></Aircraft>
        )}
    </div>
  );
}

export default Workspace;
