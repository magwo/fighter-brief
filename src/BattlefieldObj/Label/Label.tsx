import React, { FC } from 'react';
import { BattlefieldObject } from '../../battlefield-object';
import './Label.css';

interface LabelProps {
  object: BattlefieldObject,
  isInactive: boolean,
  onClick?: (e: React.MouseEvent) => void,
}

const Label: FC<LabelProps> = (props) => {

  const styles = {
    transform: `translate(${props.object.position.x}px, ${props.object.position.y}px) rotate(${props.object.heading}deg)`
  };
  
  return (
    <div className="Label" style={styles} onClick={props.onClick}>
      <p>{props.object.name}</p>
    </div>
  );
}

export default Label;
