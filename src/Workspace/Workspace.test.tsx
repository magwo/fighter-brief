import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Workspace from './Workspace';
import { toolCategories } from '../Toolbar/tools';

describe('<Workspace />', () => {
  test('it should mount', () => {
    render(<Workspace tool={toolCategories[0].tools[0]} shouldPlay={false} shouldShowPaths={true} time={0} onStopTimeChange={() => {}}/>);
    
    const workspace = screen.getByTestId('Workspace');

    expect(workspace).toBeInTheDocument();
  });
});