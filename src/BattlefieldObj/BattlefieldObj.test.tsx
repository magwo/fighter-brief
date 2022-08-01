import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BattlefieldObj from './BattlefieldObj';
import { createBattlefieldObject, Heading, Position, Speed } from '../battlefield-object';

describe('<BattlefieldObj />', () => {
  test('it should mount', () => {
    const object = createBattlefieldObject(null, "", 'viper', null, new Position(0, 0), new Heading(0), 0, new Speed(0));
    render(<BattlefieldObj object={object} isInactive={false} shouldShowPath={true} />);
    
    const aircraft = screen.getByTestId('BattlefieldObj');

    expect(aircraft).toBeInTheDocument();
  });
});