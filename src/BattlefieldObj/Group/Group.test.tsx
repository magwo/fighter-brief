import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Group from './Group';
import { createBattlefieldObject } from '../../battlefield-object';

describe('<Group />', () => {
  test('it should mount', () => {
    const object = createBattlefieldObject(null, "", 'viper', null, [0, 0], 0, 0, 0, 0, '');
    render(<Group object={object} isInactive={false} shouldShowPath={true} time={0} />);
    
    const group = screen.getByTestId('Group');

    expect(group).toBeInTheDocument();
  });
});