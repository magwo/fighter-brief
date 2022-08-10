import React, { FC, useEffect, useState } from 'react';
import { MapType } from '../battlefield-object-types';
import './Mainbar.css';

interface MainbarProps {
  scenarioName: string,
  map: MapType,
  onScenarioNameChange: (name: string) => void,
  onMapChange: (map: MapType) => void,
}

interface Values {
  scenarioName: string,
  map: MapType,
}

const Mainbar: FC<MainbarProps> = (props: MainbarProps) => {
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [values, setValues] = useState<Values>({ scenarioName: '', map: '' });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValues = {...values, scenarioName: e.target.value as MapType};
    setValues(newValues);
    props.onScenarioNameChange(newValues.scenarioName);
  }

  const handleMapChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValues = {...values, map: e.target.value as MapType};
    setValues(newValues);
    props.onMapChange(newValues.map);
  }

  useEffect(() => {
    setValues({scenarioName: props.scenarioName, map: props.map});
  }, [props.scenarioName, props.map]);

  return (
    <div className="Mainbar" data-testid="Mainbar" onMouseDown={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
      <div className="name-container">
        {!isEditingName &&
          <h1 onClick={() => setIsEditingName(true)}>{values.scenarioName}</h1>
        }
        {isEditingName &&
          <input autoFocus={true} type="text" value={values.scenarioName} onChange={handleNameChange}  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if(e.key === 'Enter') { setIsEditingName(false) } } } onBlur={() => setIsEditingName(false) } />
        }
      </div>
      <select className="map-selector" value={values.map} onChange={handleMapChange}>
        <option value="">None</option>
        <option value="ca">Caucasus</option>
        <option value="sy">Syria</option>
        <option value="pg">Persian Gulf</option>
      </select>
    </div>
  );
}

export default Mainbar;
