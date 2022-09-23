import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createBattlefieldObject } from '../../battlefield-object';
import Measurement from './Measurement';
import { CoalitionType } from '../../battlefield-object-types';

describe('<Measurement />', () => {
  test('it should mount', () => {
    const object = createBattlefieldObject(null, "measurement text", '' as CoalitionType, 'measurement', null, [0, 0], 0, 0, 0, 0, '', null);
    object.path.addPoint(0, 0);
    object.path.addPoint(10, 0);
    render(<Measurement object={object} isSelected={false} isInactive={false} />);
    
    const measurement = screen.getByTestId('Measurement');

    expect(measurement).toBeInTheDocument();
  });
});