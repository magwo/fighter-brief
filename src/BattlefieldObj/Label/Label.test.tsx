import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createBattlefieldObject, Position } from '../../battlefield-object';
import Label from './Label';

describe('<Label />', () => {
  test('it should mount', () => {
    const object = createBattlefieldObject(null, "label text", 'label', null, new Position(0, 0), 0, 0, 0);
    render(<Label object={object} isInactive={false} />);
    
    const aircraft = screen.getByTestId('Aircraft');

    expect(aircraft).toBeInTheDocument();
  });
});