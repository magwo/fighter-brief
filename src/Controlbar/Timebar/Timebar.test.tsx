import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Timebar from './Timebar';

describe('<Timebar />', () => {
  test('it should mount', () => {
    render(<Timebar time={0} stopTime={1} onDraggingTimeBar={() => ''} onTimeChange={() => ''} />);
    
    const controlbar = screen.getByTestId('Timebar');

    expect(controlbar).toBeInTheDocument();
  });
});