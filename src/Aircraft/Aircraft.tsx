import React, { FC } from 'react';
import { BattlefieldObject } from '../battlefield-object';
import './Aircraft.css';

interface AircraftProps {
  object: BattlefieldObject
}

const Aircraft: FC<AircraftProps> = (props) => {
  const styles = {
    transform: `translate(${props.object.position.x}px, ${props.object.position.y}px)`,
    'transformOrigin': '-50% -50%'
  };
  return (
    <div style={styles} className="Aircraft" data-testid="Aircraft">
      <img src={`/aviation/${props.object.type}@2x.png`} className="aircraft-image" alt="" />
      <p>{props.object.name ?? props.object.type}</p>
    </div>
  );
}

export default Aircraft;
