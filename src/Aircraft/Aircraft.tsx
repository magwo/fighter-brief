import React, { FC } from 'react';
import './Aircraft.css';

interface AircraftProps {
  name?: string,
  type: 'albatros' | 'apache' | 'awacs' | 'blackjack' | 'carrier' | 'fishbed' | 'flanker' | 'gripen' | 'harrier' | 'hercules' | 'hind' | 'hornet' | 'huey' | 'lancer' | 'stratofortress' | 'tanker' | 'thunder' | 'tiger' | 'tomcat' | 'viggen' | 'viper' | 'warthog';
}

const Aircraft: FC<AircraftProps> = (props) => (
  <div className="Aircraft" data-testid="Aircraft">
    <img src={`/aviation/${props.type}@2x.png`} className="aircraft-image" alt="" />
    <p>{props.name ?? props.type}</p>
  </div>
);

export default Aircraft;
