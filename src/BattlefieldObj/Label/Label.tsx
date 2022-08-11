import React, { FC } from 'react';
import { BattlefieldObject } from '../../battlefield-object';
import './Label.css';

interface LabelProps {
  object: BattlefieldObject;
  isSelected: boolean;
  isInactive: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const Label: FC<LabelProps> = (props) => {

  const styles = {
    transform: `translate(${props.object.position[0]}px, ${props.object.position[1]}px) rotate(${props.object.heading}deg)`
  };
  
  return (
    <div className="Label" style={styles} onClick={props.onClick} data-testid="Label">
      <p>{props.object.name}</p>
    </div>
  );
}

export default Label;
