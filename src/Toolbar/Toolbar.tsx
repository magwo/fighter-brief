import React, { FC, ReactNode, useEffect, useState } from 'react';
import { ReactComponent as ArrowPointer } from './images/arrow-pointer.svg';
import { ReactComponent as ArrowsLeftRight } from './images/arrows-left-right-to-line.svg';
import { ReactComponent as TrashCan } from './images/trash-can.svg';
import { ReactComponent as Arrow } from './images/arrow-right-long.svg';
import { ReactComponent as Line } from './images/lines-leaning.svg';
import './Toolbar.css';
import { MeasurementSubType, Tool, toolCategories } from './tools';

interface ToolbarProps {
  onToolSelected: (selectedTool: Tool) => void;
}

function renderMeasurementSubTypeIcon(subType: MeasurementSubType) {
  if(subType === 'measurement') {
    return <ArrowsLeftRight className="svg-icon" />
  } else if(subType === 'arrow') {
    return <Arrow className="svg-icon" />
  } else {
    return <Line className="svg-icon" />
  }
}

function renderTool(tool: Tool, selectedTool: Tool, setSelectedTool: (tool: Tool) => void, onToolSelectedCb: (tool: Tool) => void): ReactNode {
  if (tool.toolType === 'placeMovable' || tool.toolType === 'placeStatic') {
    return <button
      key={`aircraft-button-${tool.objectType}`}
      title={tool.label}
      onClick={() => { setSelectedTool(tool); onToolSelectedCb(tool) }} className={tool === selectedTool ? 'selected' : ''}>
      <img src={`${process.env.PUBLIC_URL}/aviation/${tool.objectType}@2x.png`} alt={`Place ${tool.objectType}`} />
      <p>{tool.objectType}</p>
    </button>;
  } else if (tool.toolType === 'placeLabel') {
    return <button
      key={`label-button`}
      title={tool.label}
      onClick={() => { setSelectedTool(tool); onToolSelectedCb(tool) }} className={tool === selectedTool ? 'selected' : ''}>
      <div className="big-text">Abc</div>
      <p>Text</p>
    </button>;
  } else if (tool.toolType === 'placeMeasurement') {
    const icon = renderMeasurementSubTypeIcon(tool.subType);
    return <button
      key={`measurement-${tool.subType}-button`}
      title={tool.title}
      onClick={() => { setSelectedTool(tool); onToolSelectedCb(tool) }} className={tool === selectedTool ? 'selected' : ''}>
      {icon}
      <p>{tool.label}</p>
    </button>;
  } else if (tool.toolType === 'select') {
    return <button
      key={`select-button`}
      title={tool.label}
      onClick={() => { setSelectedTool(tool); onToolSelectedCb(tool) }} className={tool === selectedTool ? 'selected' : ''}>
      <ArrowPointer className="svg-icon"/>
      <p>Select</p>
    </button>;
  } else if (tool.toolType === 'delete') {
    return <button
      key={`delete-button`}
      title={tool.label}
      onClick={() => { setSelectedTool(tool); onToolSelectedCb(tool) }} className={tool === selectedTool ? 'selected' : ''}>
      <TrashCan className="svg-icon" />
      <p>Delete</p>
    </button>;
  } else if (tool.toolType === 'reset') {
    return <button
      key={`reset-button`}
      title={tool.label}
      onClick={() => { alert("Not implemented. To reset, clear the URL path and reload the page."); }}>
      <p>Reset</p>
    </button>;
  }
}

function getFirstToolByType(toolType: string): Tool | null {
  for (let cat of toolCategories) {
    for (let tool of cat.tools) {
      if (tool.toolType === toolType) {
        return tool;
      }
    }
  }
  return null;
}

// TODO: Expandable categories
const Toolbar: FC<ToolbarProps> = (props: ToolbarProps) => {
  const [selectedTool, setSelectedTool] = useState<Tool>(toolCategories[0].tools[0]);
  const [expandedCategory, setExpandedCategory] = useState<string>("");

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "v") {
      setToolByNameAndNotify('select');
    } else if (e.key === "t") {
      setToolByNameAndNotify('placeLabel');
    } else if (e.key === "m") {
      setToolByNameAndNotify('placeMeasurement');
    } else if (e.key === "d") {
      setToolByNameAndNotify('delete');
    }
  };
  
  useEffect(() => {
    // Setup global keypress handler
    window.document.addEventListener("keydown", handleKeydown);
    return () => {
      window.document.removeEventListener('keydown', handleKeydown);
    }
  }, [handleKeydown]);
  
  const setToolByNameAndNotify = (toolName: string) => {
    const tool = getFirstToolByType(toolName);
    if (tool) {
      setSelectedTool(tool);
      props.onToolSelected(tool);
    }
  }

  const tools = toolCategories.map((c) => {
    const isExpanded = (c.showAlways || expandedCategory === c.categoryName);
    // const filteredTools = isExpanded ? c.tools : c.tools.slice(0, 2);
    const buttonsStyle = isExpanded ? {} : {
      maxHeight: '30px',
      filter: 'drop-shadow(0px 10px 5px rgba(0,0,0,0.1))',
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
