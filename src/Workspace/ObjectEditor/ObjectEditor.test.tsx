import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ObjectEditor from './ObjectEditor';
import { createBattlefieldObject, Heading, Position, Speed } from '../../battlefield-object';

describe('<ObjectEditor />', () => {
  test('it should mount', () => {
    const object = createBattlefieldObject(null, "", 'viper', null, new Position(0, 0), new Heading(0), 0, new Speed(0));
    render(<ObjectEditor object={object} onObjectModified={() => {}} />);
    
    const objectEditor = screen.getByTestId('ObjectEditor');

    expect(objectEditor).toBeInTheDocument();
  });
});