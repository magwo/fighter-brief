import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Controlbar from './Controlbar';

describe('<Controlbar />', () => {
  test('it should mount', () => {
    render(<Controlbar onPlayPause={() => ''}/>);
    
    const controlbar = screen.getByTestId('Controlbar');

    expect(controlbar).toBeInTheDocument();
  });
});