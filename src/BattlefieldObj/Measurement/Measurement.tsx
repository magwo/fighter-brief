import React, { FC } from 'react';
import { BattlefieldObject } from '../../battlefield-object';
import { MeasurementSubType } from '../../battlefield-object-types';
import './Measurement.css';

interface MeasurementProps {
  object: BattlefieldObject;
  isSelected: boolean;
  isInactive: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const RIGHT_ARROW_TYPES: MeasurementSubType[] = [
  'measurement',
  'arrow',
]

const Measurement: FC<MeasurementProps> = (props) => {

  const p1 = props.object.path.points[0];
  const p2 = props.object.path.points[1];
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const heading = Math.atan2(dy, dx) * (360 / (Math.PI * 2));
  const length = Math.sqrt(dx * dx + dy * dy);

  const styles = {
    transform: `translate(${props.object.position[0]}px, calc(${props.object.position[1]}px - 7px)) rotate(${heading}deg)`,
    width: `${length}px`
  };

  let textStyles = {};
  if (heading < -90 || heading > 90) {
    textStyles = { transform: 'rotate(180deg)' };
  }
  
  return (
    <div className={`Measurement${props.isSelected ? ' is-selected' : ''}`} style={styles} onClick={props.onClick} data-testid="Measurement">
      {props.object.type === 'measurement' &&
        <div className="left-arrow">◀</div>
      }
      <div className="line"></div>
      <p className={`${props.object.name.length === 0 ? "empty" : ""}`} style={textStyles}>{props.object.name}</p>
      <div className="line"></div>
      {RIGHT_ARROW_TYPES.includes(props.object.type) &&
        <div className="right-arrow">▶</div>
      }
    </div>
  );
}

export default Measurement;
