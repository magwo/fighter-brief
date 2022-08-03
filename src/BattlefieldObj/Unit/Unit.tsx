import React, { FC } from 'react';
import { BattlefieldObject } from '../../battlefield-object';
import { airplaneList, AirplaneType, BattleFieldObjectType, helicopterList, HelicopterType, shipList, ShipType, staticList, StaticType, weaponList, WeaponType } from '../../battlefield-object-types';
import './Unit.css';


function getTypeClass(type: BattleFieldObjectType) {
  if (airplaneList.includes(type as AirplaneType)) {
    return 'is-airplane';
  } else if (helicopterList.includes(type as HelicopterType)) {
    return 'is-helicopter';
  } else if (staticList.includes(type as StaticType)) {
    return 'is-static';
  } else if (shipList.includes(type as ShipType)) {
    return 'is-ground-mover';
  } else if (weaponList.includes(type as WeaponType)) {
    return 'is-weapon';
  }
  return 'is-airplane';
}

interface UnitProps {
  object: BattlefieldObject,
  isInactive: boolean,
  shouldShowPath: boolean,
  onClick?: (e: React.MouseEvent) => void,
}

const Unit: FC<UnitProps> = (props) => {
  const styles = {
    transform: `translate(${props.object.position.x - 16}px, ${props.object.position.y - 16}px)`
  };
  let graphicsStyles = {
    transform: `rotate(${props.object.heading.heading}deg)`
  }
  let endPosStyles;
  let svgPoly;
  if (props.object.path.points.length > 0 && props.object.path.curve) {
    const posAtEnd = props.object.path.getPositionAlongCurveNorm(1);
    const headingAtEnd = props.object.path.getHeadingAlongCurveNorm(1);
    endPosStyles = {
      transform: `translate(${posAtEnd.x - 16}px, ${posAtEnd.y - 16}px) rotate(${headingAtEnd}deg)`
    }
    svgPoly = props.object.path.points.map((p) => `${p.x},${p.y}`).join(" ");
  }

  // TODO: Import images instead

  return (
    <div className={`Unit ${getTypeClass(props.object.type)}`} data-testid="Unit" onClick={props.onClick}>
      {endPosStyles && props.shouldShowPath && (
        <div className="path">
          <svg overflow="visible">
            <polyline points={svgPoly}></polyline>
          </svg>
        </div>
      )}
      <div style={styles} className={`primary-container`}>
        <div style={graphicsStyles} className={`graphics-container${props.isInactive ? " inactive" : ""}`}>
          <img src={`${process.env.PUBLIC_URL}/aviation/${props.object.hasReachedEnd && !props.isInactive && props.object.endType ? props.object.endType : props.object.type}@2x.png`} className="unit-image" draggable="false" alt="" />
        </div>
        <p>{props.object.name}</p>
      </div>
      {endPosStyles && props.shouldShowPath && (
      <div style={endPosStyles} className="primary-container">
        <div className={`graphics-container ghost`}>
          <img src={`${process.env.PUBLIC_URL}/aviation/${props.object.type}@2x.png`} className="unit-image" draggable="false" alt="" />
        </div>
      </div>
      )}
    </div>
  );
}

export default Unit;
