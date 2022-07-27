import React, { FC } from 'react';
import { BattlefieldObject } from '../battlefield-object';
import './Aircraft.css';

interface AircraftProps {
  object: BattlefieldObject,
  isInactive: boolean
}

const Aircraft: FC<AircraftProps> = (props) => {
  const styles = {
    transform: `translate(${props.object.position.x - 16}px, ${props.object.position.y - 16}px)`
  };
  const graphicsStyles = {
    transform: `rotate(${props.object.heading.heading}deg)`
  }
  return (
    <div style={styles} className="Aircraft" data-testid="Aircraft">
      <div style={graphicsStyles} className={`graphics-container${props.isInactive ? " inactive" : ""}`}>
        <img src={`/aviation/${props.object.type}@2x.png`} className="aircraft-image" alt="" />
      </div>
      {/* <p>{props.object.type} {props.object.id}</p> */}
    </div>
  );
}

export default Aircraft;
