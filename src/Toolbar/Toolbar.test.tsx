import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Toolbar from './Toolbar';

describe('<Toolbar />', () => {
  test('it should mount', () => {
    render(<Toolbar />);
    
    const toolbar = screen.getByTestId('Toolbar');

    expect(toolbar).toBeInTheDocument();
  });
});