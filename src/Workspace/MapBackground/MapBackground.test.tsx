import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MapBackground from './MapBackground';

describe('<MapBackground />', () => {
  test('it should mount', () => {
    render(<MapBackground map="sy" />);
    
    const mapBackground = screen.getByTestId('MapBackground');

    expect(mapBackground).toBeInTheDocument();
  });
});