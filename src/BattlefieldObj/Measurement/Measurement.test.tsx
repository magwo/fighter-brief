import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createBattlefieldObject, Heading, Position, Speed } from '../../battlefield-object';
import Measurement from './Measurement';

describe('<Measurement />', () => {
  test('it should mount', () => {
    const object = createBattlefieldObject(null, "measurement text", 'measurement', null, new Position(0, 0), new Heading(0), 0, new Speed(0));
    render(<Measurement object={object} isInactive={false} />);
    
    const aircraft = screen.getByTestId('Aircraft');

    expect(aircraft).toBeInTheDocument();
  });
});