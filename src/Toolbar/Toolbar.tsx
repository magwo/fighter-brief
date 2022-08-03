import React, { FC, ReactNode, useState } from 'react';
import { ReactComponent as ArrowPointer } from './images/arrow-pointer.svg';
import { ReactComponent as ArrowsLeftRight } from './images/arrows-left-right-to-line.svg';
import { ReactComponent as TrashCan } from './images/trash-can.svg';
import './Toolbar.css';
import { Tool, toolCategories } from './tools';

interface ToolbarProps {
  onToolSelected: (selectedTool: Tool) => void;
}

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
      <div className="big-text">Abc</div>
      <p>Text</p>
    </button>;
  } else if (tool.toolType === 'placeMeasurement') {
    return <button
      key={`measurement-button`}
      onClick={() => { setSelectedTool(tool); onToolSelectedCb(tool) }} className={tool === selectedTool ? 'selected' : ''}>
      <ArrowsLeftRight className="svg-icon" />
      <p>Measure</p>
    </button>;
  } else if (tool.toolType === 'select') {
    return <button
      key={`select-button`}
      onClick={() => { setSelectedTool(tool); onToolSelectedCb(tool) }} className={tool === selectedTool ? 'selected' : ''}>
      <ArrowPointer className="svg-icon"/>
      <p>Select</p>
    </button>;
  } else if (tool.toolType === 'delete') {
    return <button
      key={`delete-button`}
      onClick={() => { setSelectedTool(tool); onToolSelectedCb(tool) }} className={tool === selectedTool ? 'selected' : ''}>
      <TrashCan className="svg-icon" />
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
