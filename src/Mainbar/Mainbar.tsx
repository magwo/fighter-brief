import React, { FC, useState } from 'react';
import { MapType } from '../battlefield-object-types';
import { ReactComponent as ShareIcon } from './images/share-from-square.svg';
import './Mainbar.css';

function getStringHashNumber(str: string): number {
  return str.split('').reduce((prevHash, currVal) =>
    (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
}

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

  const getShortUrl = () => {
    const ourUrl = encodeURI(window.location.href + window.location.hash);
    console.log("Our URL is", ourUrl);
    const desiredShortUrl = 'fighterbrief' + Math.round(getStringHashNumber(ourUrl)).toString(36);
    console.log("Desired short URL is", desiredShortUrl);
    const fullUrl = `https://is.gd/create.php?format=simple&shorturl=${desiredShortUrl}&url=${ourUrl}`;
    fetch(fullUrl, { method: 'GET', mode: 'cors', headers: { 'Content-Type': 'text/plain' } })
    .then((response: Response) => response.text())
    .then((text) => {
      console.log("Got response text", text);
      navigator.clipboard?.writeText(text).then(() => {
          console.log("Copied URL!", text);
        });
      });
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
        <button className='clickable' onClick={() => getShortUrl()}>
          <ShareIcon className="svg-icon" />
        </button>
    </div>
  );
}

export default Mainbar;
