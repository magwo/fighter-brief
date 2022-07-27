import React, { FC, useState } from 'react';
import './Toolbar.css';

interface ToolbarProps { }

const aircraftButtons = [
  'viper',
  'hornet',
  'viggen',
  'tomcat',
  'warthog',
  'albatros',
  'apache',
  'awacs',
  'blackjack',
  'carrier',
  'fishbed',
  'flanker',
  'gripen',
  'harrier',
  'hercules',
  'hind',
  'huey',
  'lancer',
  'stratofortress',
  'tanker',
  'thunder',
  'tiger',
]

const Toolbar: FC<ToolbarProps> = () => {
  const [selectedButton, setSelectedButton] = useState('viper');

  // TODO: Add output callback
  
  return (
    <div className="Toolbar" data-testid="Toolbar">
      <div className="buttons">
        {aircraftButtons.map((a) =>
          <button onClick={() => setSelectedButton(a)} className={a === selectedButton ? 'selected' : ''}>
            <img src={`aviation/${a}@2x.png`} alt={`Place ${a}`} title={`Place ${a}`}/>
          </button>
        )}
      </div>
    </div>
  );
}

export default Toolbar;
