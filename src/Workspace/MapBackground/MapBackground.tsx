import React, { FC } from 'react';
import { MapType } from '../../battlefield-object-types';
import caucasus from './caucasus.jpg';
import syria from './syria.jpg';
import persianGulf from './persiangulf.jpg';
import './MapBackground.css';

// Note about map images:
// All images must be authored so that each pixel corresponds
// to the number specified in PositionMath (2.14 at time of writing)

interface MapBackgroundProps {
  map: MapType
}

const MapBackground: FC<MapBackgroundProps> = (props: MapBackgroundProps) => {
  return (
    <div className="MapBackground" data-testid="MapBackground">
      {props.map === 'ca' &&
        <img className="caucasus" src={caucasus} draggable="false"></img>
      }
      {props.map === 'sy' &&
        <img className="syria" src={syria} draggable="false"></img>
      }
      {props.map === 'pg' &&
        <img className="persian-gulf" src={persianGulf} draggable="false"></img>
      }
    </div>
  );
}

export default MapBackground;
