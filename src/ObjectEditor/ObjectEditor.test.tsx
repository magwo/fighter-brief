import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ObjectEditor from './ObjectEditor';
import { createBattlefieldObject } from '../battlefield-object';

describe('<ObjectEditor />', () => {
  test('it should mount', () => {
    const object = createBattlefieldObject(null, "", 'viper', null, [0, 0], 0, 0, 0, 0, '');
    render(<ObjectEditor object={object} onObjectModified={() => {}} />);
    
    const objectEditor = screen.getByTestId('ObjectEditor');

    expect(objectEditor).toBeInTheDocument();
  });
});