import React, { FC, useState } from 'react';
import { AircraftType, EndType, ShipType, StaticType, WeaponType } from '../battlefield-object-types';
import './Toolbar.css';

interface ToolbarProps {
  onToolSelected: (selectedTool: Tool) => void;
}

export interface PlaceMovableTool {
  toolType: 'placeMovable';
  objectType: AircraftType | ShipType | WeaponType;
  speedKnots: number;
  endType: EndType | null;
}

export interface PlaceStaticTool {
  toolType: 'placeStatic';
  objectType: StaticType;
}

export interface DeleteTool {
  toolType: 'delete';
}

export interface ResetTool {
  toolType: 'reset';
}

export type Tool = PlaceMovableTool | PlaceStaticTool | DeleteTool | ResetTool;

export const toolButtons: Tool[] = [
  { toolType: 'placeMovable', objectType: 'viper', speedKnots: 400, endType: null },
  { toolType: 'placeMovable', objectType: 'hornet', speedKnots: 400, endType: null },
  { toolType: 'placeMovable', objectType: 'viggen', speedKnots: 400, endType: null },
  { toolType: 'placeMovable', objectType: 'tomcat', speedKnots: 400, endType: null },
  { toolType: 'placeMovable', objectType: 'warthog', speedKnots: 200, endType: null },
  // { toolType: 'placeMovable', objectType: 'albatros', speedKnots: 200, endType: null },
  { toolType: 'placeMovable', objectType: 'apache', speedKnots: 150, endType: null },
  { toolType: 'placeMovable', objectType: 'awacs', speedKnots: 400, endType: null },
  { toolType: 'placeMovable', objectType: 'blackjack', speedKnots: 400, endType: null },
  { toolType: 'placeMovable', objectType: 'fishbed', speedKnots: 400, endType: null },
  { toolType: 'placeMovable', objectType: 'flanker', speedKnots: 400, endType: null },
  { toolType: 'placeMovable', objectType: 'gripen', speedKnots: 400, endType: null },
  { toolType: 'placeMovable', objectType: 'harrier', speedKnots: 400, endType: null },
  { toolType: 'placeMovable', objectType: 'hercules', speedKnots: 400, endType: null },
  { toolType: 'placeMovable', objectType: 'hind', speedKnots: 150, endType: null },
  { toolType: 'placeMovable', objectType: 'huey', speedKnots: 100, endType: null },
  { toolType: 'placeMovable', objectType: 'lancer', speedKnots: 400, endType: null },
  // { toolType: 'placeMovable', objectType: 'stratofortress', speedKnots: 400, endType: null },
  { toolType: 'placeMovable', objectType: 'tanker', speedKnots: 400, endType: null },
  // { toolType: 'placeMovable', objectType: 'thunder', speedKnots: 400, endType: null },
  // { toolType: 'placeMovable', objectType: 'tiger', speedKnots: 400, endType: null },
  { toolType: 'placeMovable', objectType: 'mk82', speedKnots: 300, endType: 'expl_m' },
  { toolType: 'placeMovable', objectType: 'amraam', speedKnots: 800, endType: 'expl_m' },
  { toolType: 'placeMovable', objectType: 'sidewinder', speedKnots: 800, endType: 'expl_m' },
  { toolType: 'placeMovable', objectType: 'carrier', speedKnots: 30, endType: null },
  { toolType: 'placeStatic', objectType: 'airfield', },
  { toolType: 'delete' },
  { toolType: 'reset' },
]

const Toolbar: FC<ToolbarProps> = (props: ToolbarProps) => {
  const [selectedTool, setSelectedTool] = useState(toolButtons[0]);

  const tools = toolButtons.map((a) => {
    if (a.toolType === 'placeMovable' || a.toolType === 'placeStatic') {
      return <button 
          key={`aircraft-button-${a.objectType}`}
          onClick={() => {setSelectedTool(a); props.onToolSelected(a)}} className={a === selectedTool ? 'selected' : ''}>
          <img src={`aviation/${a.objectType}@2x.png`} alt={`Place ${a}`} title={`Place ${a.objectType}`}/>
          <p>{a.objectType}</p>
        </button>;
    } else if (a.toolType === 'delete') {
      return <button 
          key={`delete-button`}
          onClick={() => {setSelectedTool(a); props.onToolSelected(a)}} className={a === selectedTool ? 'selected' : ''}>
          {/* <img src={`aviation/${a.objectType}@2x.png`} alt={`Place ${a}`} title={`Place ${a.objectType}`}/> */}
          <p>Delete</p>
        </button>;
    }
    else if (a.toolType === 'reset') {
      return <button 
          key={`reset-button`}
          onClick={() => { alert("Not implemented. To reset, clear the URL path and reload the page."); } }>
          {/* <img src={`aviation/${a.objectType}@2x.png`} alt={`Place ${a}`} title={`Place ${a.objectType}`}/> */}
          <p>Reset</p>
        </button>;
    }
  });

  return (
    <div className="Toolbar" data-testid="Toolbar">
      <div className="buttons">
        {tools}
      </div>
    </div>
  );
}

export default Toolbar;
