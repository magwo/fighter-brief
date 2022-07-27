import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Aircraft from './Aircraft';

describe('<Aircraft />', () => {
  test('it should mount', () => {
    render(<Aircraft type="viper" />);
    
    const aircraft = screen.getByTestId('Aircraft');

    expect(aircraft).toBeInTheDocument();
  });
});