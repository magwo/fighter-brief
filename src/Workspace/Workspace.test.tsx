import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Workspace from './Workspace';
import { toolCategories } from '../Toolbar/tools';

describe('<Workspace />', () => {
  test('it should mount', () => {
    // TOOD: Test with objects actually being something
    render(<Workspace objects={[]} selectedObject={null} onSelectedObject={() => {}} tool={toolCategories[0].tools[0]} map="" shouldPlay={false} shouldShowPaths={true} time={0} pseudoTime={0} pan={[0, 0]} zoom={1} onPseudoTimeChange={() => {}} onStopTimeChange={() => {}} onObjectsChange={() => {}} onPanChange={() => {}} onZoomChange={() => {}}/>);
    
    const workspace = screen.getByTestId('Workspace');

    expect(workspace).toBeInTheDocument();
  });
});