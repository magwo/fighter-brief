import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createBattlefieldObject } from '../../battlefield-object';
import Measurement from './Measurement';

describe('<Measurement />', () => {
  test('it should mount', () => {
    const object = createBattlefieldObject(null, "measurement text", 'measurement', null, [0, 0], 0, 0, 0, 0, '');
    render(<Measurement object={object} isInactive={false} />);
    
    const aircraft = screen.getByTestId('Aircraft');

    expect(aircraft).toBeInTheDocument();
  });
});