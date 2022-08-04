import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Unit from './Unit';
import { createBattlefieldObject, Position } from '../../battlefield-object';

describe('<Unit />', () => {
  test('it should mount', () => {
    const object = createBattlefieldObject(null, "", 'viper', null, [0, 0], 0, 0, 0);
    render(<Unit object={object} isInactive={false} shouldShowPath={true} />);
    
    const unit = screen.getByTestId('Unit');

    expect(unit).toBeInTheDocument();
  });
});