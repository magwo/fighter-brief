import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Aircraft from './Aircraft';
import { BattlefieldObject, Heading, Position, Speed } from '../battlefield-object';

describe('<Aircraft />', () => {
  test('it should mount', () => {
    const object = new BattlefieldObject("", 'viper', new Position(0, 0), new Heading(0), new Speed(0));
    render(<Aircraft object={object} isInactive={false}/>);
    
    const aircraft = screen.getByTestId('Aircraft');

    expect(aircraft).toBeInTheDocument();
  });
});