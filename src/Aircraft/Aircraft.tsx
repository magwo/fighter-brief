import { object } from 'prop-types';
import React, { FC } from 'react';
import { BattlefieldObject } from '../battlefield-object';
import './Aircraft.css';

interface AircraftProps {
  object: BattlefieldObject,
  isInactive: boolean,
  shouldShowPath: boolean,
}

const Aircraft: FC<AircraftProps> = (props) => {
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

  return (
    <div className="Aircraft" data-testid="Aircraft">
      {endPosStyles && props.shouldShowPath && (
        <div className="path">
          <svg overflow="visible">
            <polyline points={svgPoly}></polyline>
          </svg>
        </div>
      )}
      <div style={styles} className="primary-container">
        <div style={graphicsStyles} className={`graphics-container${props.isInactive ? " inactive" : ""}`}>
          <img src={`aviation/${props.object.type}@2x.png`} className="aircraft-image" alt="" />
        </div>
      </div>
      {endPosStyles && props.shouldShowPath && (
      <div style={endPosStyles} className="primary-container">
        <div className={`graphics-container ghost`}>
          <img src={`aviation/${props.object.type}@2x.png`} className="aircraft-image" alt="" />
        </div>
      </div>
      )}
      {/* <p>{props.object.type} {props.object.id}</p> */}
    </div>
  );
}

export default Aircraft;
