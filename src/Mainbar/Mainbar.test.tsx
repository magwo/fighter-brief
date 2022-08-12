import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Mainbar from './Mainbar';

describe('<Mainbar />', () => {
  test('it should mount', () => {
    render(<Mainbar scenarioName='New scenario' map={''} fullUrl={''} onMapChange={() => {}} onScenarioNameChange={() => {}} />);
    
    const mainbar = screen.getByTestId('Mainbar');

    expect(mainbar).toBeInTheDocument();
  });
});