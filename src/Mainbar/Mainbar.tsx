import React, { FC, useState } from 'react';
import { MapType } from '../battlefield-object-types';
import './Mainbar.css';

interface MainbarProps {
  scenarioName: string,
  map: MapType,
  onScenarioNameChange: (name: string) => void,
  onMapChange: (map: MapType) => void,
}

const Mainbar: FC<MainbarProps> = (props: MainbarProps) => {
  const [isEditingName, setIsEditingName] = useState<boolean>(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onScenarioNameChange(e.target.value as MapType);
  }

  const handleMapChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    props.onMapChange(e.target.value as MapType);
  }

  return (
    <div className="Mainbar" data-testid="Mainbar" onMouseDown={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
      <div className="name-container">
        {!isEditingName &&
          <h1 onClick={() => setIsEditingName(true)}>{props.scenarioName}</h1>
        }
        {isEditingName &&
          <input autoFocus={true} type="text" value={props.scenarioName} onChange={handleNameChange}  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if(e.key === 'Enter') { setIsEditingName(false) } } } onBlur={() => setIsEditingName(false) } />
        }
      </div>
      <div className="select-wrapper">
        <select className="map-selector" value={props.map} onChange={handleMapChange}>
          <option value="">None</option>
          <option value="ca">Caucasus</option>
          <option value="sy">Syria</option>
          <option value="pg">Persian Gulf</option>
        </select>
        </div>
    </div>
  );
}

export default Mainbar;
