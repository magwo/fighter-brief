import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BattlefieldObj from './BattlefieldObj';
import { createBattlefieldObject } from '../battlefield-object';

describe('<BattlefieldObj />', () => {
  test('it should mount', () => {
    const object = createBattlefieldObject(null, "", '', 'viper', null, [0, 0], 0, 0, 0, 0, '', Number.MAX_SAFE_INTEGER);
    render(<BattlefieldObj object={object} isSelected={false} isInactive={false} shouldShowPath={true} time={0} />);
    
    const aircraft = screen.getByTestId('BattlefieldObj');

    expect(aircraft).toBeInTheDocument();
  });
});