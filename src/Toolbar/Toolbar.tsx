import React, { FC, ReactNode, useState } from 'react';
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

export interface PlaceLabelTool {
  toolType: 'placeLabel';
}

export interface PlaceMeasurementTool {
  toolType: 'placeMeasurement';
}
export interface SelectTool {
  toolType: 'select';
}

export type Tool = PlaceMovableTool | PlaceStaticTool | DeleteTool | ResetTool | PlaceLabelTool | PlaceMeasurementTool | SelectTool;

export const toolCategories: { categoryName: string, showAlways: boolean, tools: Tool[] }[] = [
  {
    categoryName: 'General',
    showAlways: true,
    tools: [
      { toolType: 'select' },
      { toolType: 'delete' },
      { toolType: 'placeLabel' },
      { toolType: 'placeMeasurement' },
      // { toolType: 'reset' },
    ]
  },
  {
    categoryName: 'Fast Jets',
    showAlways: false,
    tools: [
      { toolType: 'placeMovable', objectType: 'viper', speedKnots: 400, endType: null },
      { toolType: 'placeMovable', objectType: 'hornet', speedKnots: 400, endType: null },
      { toolType: 'placeMovable', objectType: 'viggen', speedKnots: 400, endType: null },
      { toolType: 'placeMovable', objectType: 'tomcat', speedKnots: 400, endType: null },
      { toolType: 'placeMovable', objectType: 'warthog', speedKnots: 200, endType: null },
      { toolType: 'placeMovable', objectType: 'albatros', speedKnots: 200, endType: null },
      { toolType: 'placeMovable', objectType: 'fishbed', speedKnots: 400, endType: null },
      { toolType: 'placeMovable', objectType: 'flanker', speedKnots: 400, endType: null },
      { toolType: 'placeMovable', objectType: 'gripen', speedKnots: 400, endType: null },
      { toolType: 'placeMovable', objectType: 'thunder', speedKnots: 400, endType: null },
      { toolType: 'placeMovable', objectType: 'tiger', speedKnots: 400, endType: null },
      { toolType: 'placeMovable', objectType: 'harrier', speedKnots: 400, endType: null },
    ]
  },
  {
    categoryName: 'Heavies',
    showAlways: false,
    tools: [
      { toolType: 'placeMovable', objectType: 'awacs', speedKnots: 400, endType: null },
      { toolType: 'placeMovable', objectType: 'blackjack', speedKnots: 400, endType: null },
      { toolType: 'placeMovable', objectType: 'hercules', speedKnots: 200, endType: null },
      { toolType: 'placeMovable', objectType: 'lancer', speedKnots: 400, endType: null },
      { toolType: 'placeMovable', objectType: 'stratofortress', speedKnots: 400, endType: null },
      { toolType: 'placeMovable', objectType: 'tanker', speedKnots: 400, endType: null },
    ]
  },
  {
    categoryName: 'Helicopters',
    showAlways: false,
    tools: [
      { toolType: 'placeMovable', objectType: 'apache', speedKnots: 150, endType: null },
      { toolType: 'placeMovable', objectType: 'hind', speedKnots: 150, endType: null },
      { toolType: 'placeMovable', objectType: 'huey', speedKnots: 100, endType: null },
    ]
  },
  {
    categoryName: 'Weapons',
    showAlways: false,
    tools: [
      { toolType: 'placeMovable', objectType: 'mk82', speedKnots: 300, endType: 'expl_m' },
      { toolType: 'placeMovable', objectType: 'amraam', speedKnots: 1000, endType: 'expl_m' },
      { toolType: 'placeMovable', objectType: 'sidewinder', speedKnots: 1000, endType: 'expl_m' },
    ]
  },
  {
    categoryName: 'Ships',
    showAlways: false,
    tools: [
      { toolType: 'placeMovable', objectType: 'carrier', speedKnots: 30, endType: null },
    ]
  },
  // {
  //   categoryName: 'Ground',
  //   showAlways: false,
  //   tools: [
  //   ]
  // },
  {
    categoryName: 'Installations',
    showAlways: false,
    tools: [
      { toolType: 'placeStatic', objectType: 'airfield', },
    ]
  },
]

function renderTool(tool: Tool, selectedTool: Tool, setSelectedTool: (tool: Tool) => void, onToolSelectedCb: (tool: Tool) => void): ReactNode {
  if (tool.toolType === 'placeMovable' || tool.toolType === 'placeStatic') {
    return <button
      key={`aircraft-button-${tool.objectType}`}
      onClick={() => { setSelectedTool(tool); onToolSelectedCb(tool) }} className={tool === selectedTool ? 'selected' : ''}>
      <img src={`${process.env.PUBLIC_URL}/aviation/${tool.objectType}@2x.png`} alt={`Place ${tool.objectType}`} title={`Place ${tool.objectType}`} />
      <p>{tool.objectType}</p>
    </button>;
  } else if (tool.toolType === 'placeLabel') {
    return <button
      key={`label-button`}
      onClick={() => { setSelectedTool(tool); onToolSelectedCb(tool) }} className={tool === selectedTool ? 'selected' : ''}>
      <p>Text</p>
    </button>;
  } else if (tool.toolType === 'placeMeasurement') {
    return <button
      key={`measurement-button`}
      onClick={() => { setSelectedTool(tool); onToolSelectedCb(tool) }} className={tool === selectedTool ? 'selected' : ''}>
      <p>Measure</p>
    </button>;
  } else if (tool.toolType === 'select') {
    return <button
      key={`select-button`}
      onClick={() => { setSelectedTool(tool); onToolSelectedCb(tool) }} className={tool === selectedTool ? 'selected' : ''}>
      <p>Select</p>
    </button>;
  } else if (tool.toolType === 'delete') {
    return <button
      key={`delete-button`}
      onClick={() => { setSelectedTool(tool); onToolSelectedCb(tool) }} className={tool === selectedTool ? 'selected' : ''}>
      <p>Delete</p>
    </button>;
  } else if (tool.toolType === 'reset') {
    return <button
      key={`reset-button`}
      onClick={() => { alert("Not implemented. To reset, clear the URL path and reload the page."); }}>
      <p>Reset</p>
    </button>;
  }
}

// TODO: Expandable categories
const Toolbar: FC<ToolbarProps> = (props: ToolbarProps) => {
  const [selectedTool, setSelectedTool] = useState<Tool>(toolCategories[0].tools[0]);
  const [expandedCategory, setExpandedCategory] = useState<string>("");

  const tools = toolCategories.map((c) => {
    const isExpanded = (c.showAlways || expandedCategory === c.categoryName);
    // const filteredTools = isExpanded ? c.tools : c.tools.slice(0, 2);
    const buttonsStyle = isExpanded ? {} : {
      maxHeight: '30px',
      filter: 'drop-shadow(0px 10px 5px rgba(0,0,0,0.1))',
      overflow: 'hidden'
    };
    return (
      <div className="category" key={'category-' + c.categoryName}>
        {!c.showAlways &&
          <button onClick={() => setExpandedCategory(c.categoryName !== expandedCategory ? c.categoryName : '')}>{c.categoryName}{expandedCategory === c.categoryName ? ' ▲' : ' ▼'}</button>
        }
        <div className="buttons" style={buttonsStyle}>
          {
            c.tools.map((t: Tool) => { return renderTool(t, selectedTool, setSelectedTool, props.onToolSelected) }) 
          }
        </div>
        <div className={`shadow${isExpanded ? '' : ' visible'}`}></div>
      </div>
    )
  });

  return (
    <div className="Toolbar" data-testid="Toolbar">
      {tools}
    </div>
  );
}

export default Toolbar;
