import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Workspace from './Workspace';
import { toolButtons } from '../Toolbar/Toolbar';

describe('<Workspace />', () => {
  test('it should mount', () => {
    render(<Workspace tool={toolButtons[0]} shouldPlay={false} time={0} onStopTimeChange={() => {}}/>);
    
    const workspace = screen.getByTestId('Workspace');

    expect(workspace).toBeInTheDocument();
  });
});