import React, { FC, useEffect, useState } from 'react';
import { MapType } from '../battlefield-object-types';
import { ReactComponent as ShareIcon } from './images/share-from-square.svg';
import './Mainbar.css';

function getNeatRandomString(): string {
  const BIG_INT1 = 10e7;
  const BIG_INT2 = 10e11;
  const num = Math.round(BIG_INT1 + Math.random() * BIG_INT2);
  return num.toString(36);
}

interface MainbarProps {
  scenarioName: string,
  map: MapType,
  fullUrl: string;
  onScenarioNameChange: (name: string) => void,
  onMapChange: (map: MapType) => void,
}

const Mainbar: FC<MainbarProps> = (props: MainbarProps) => {
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string>('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onScenarioNameChange(e.target.value as MapType);
  }

  const handleMapChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    props.onMapChange(e.target.value as MapType);
  }

  // const getShortUrl = () => {
  //   // TODO: Fix annoying CORS errors so that we can produce the URL
  //   const ourUrl = encodeURI(window.location.href + window.location.hash);
  //   console.log("Our URL is", ourUrl);
  //   const desiredShortUrl = 'fighterbrief_' + Math.round(getStringHashNumber(ourUrl)).toString(36);
  //   console.log("Desired short URL is", desiredShortUrl);
  //   const fullUrl = `https://is.gd/create.php?format=simple&shorturl=${desiredShortUrl}&url=${ourUrl}`;
  //   fetch(fullUrl, { method: 'GET', mode: 'cors', headers: { 'Content-Type': 'text/plain' } })
  //   .then((response: Response) => response.text())
  //   .then((text) => {
  //     console.log("Got response text", text);
  //     navigator.clipboard?.writeText(text).then(() => {
  //         console.log("Copied URL!", text);
  //       });
  //     });
  // }

  useEffect(() => {
    const ourUrl = encodeURIComponent(props.fullUrl);
    console.log("Our url is", ourUrl);
    const desiredShortUrl = 'fighterbrief_' + getNeatRandomString();
    console.log("Desired short url is", desiredShortUrl);
    const urlShorteningUrl = `https://is.gd/create.php?format=web&shorturl=${desiredShortUrl}&url=${ourUrl}`;
    setShareUrl(urlShorteningUrl);
  }, [props.fullUrl]);

  return (
    <div className="Mainbar" data-testid="Mainbar" onMouseDown={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
      <div className="name-container">
        {!isEditingName &&
          <h1 onClick={() => setIsEditingName(true)} title="Click to edit scenario name">{props.scenarioName}</h1>
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
        <a className='clickable' href={shareUrl} target="_blank" title="Share scenario using URL shortener">
          <ShareIcon className="svg-icon" />
        </a>
    </div>
  );
}

export default Mainbar;
