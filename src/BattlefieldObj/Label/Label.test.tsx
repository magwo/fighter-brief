import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createBattlefieldObject } from '../../battlefield-object';
import Label from './Label';

describe('<Label />', () => {
  test('it should mount', () => {
    const object = createBattlefieldObject(null, "label text", 'label', null, [0, 0], 0, 0, 0, 0, '');
    render(<Label object={object} isSelected={false} isInactive={false} />);
    
    const label = screen.getByTestId('Label');

    expect(label).toBeInTheDocument();
  });
});