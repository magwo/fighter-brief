import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Workspace from './Workspace';

describe('<Workspace />', () => {
  test('it should mount', () => {
    render(<Workspace activeTool='' shouldPlay={false} />);
    
    const workspace = screen.getByTestId('Workspace');

    expect(workspace).toBeInTheDocument();
  });
});