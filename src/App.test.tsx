import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('<App />', () => {
  test('it should mount', () => {
    render(<App />);
    const app = screen.getByTestId('App');
    expect(app).toBeInTheDocument();
  });
});