import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Workspace from './Workspace';

describe('<Workspace />', () => {
  test('it should mount', () => {
    render(<Workspace activeTool='' shouldPlay={false} time={0} timeDelta={0} />);
    
    const workspace = screen.getByTestId('Workspace');

    expect(workspace).toBeInTheDocument();
  });
});