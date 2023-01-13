import React from 'react';
import { render, screen } from './utils/render';
import HotToday from '../HotToday';
import '@testing-library/jest-dom';
import reduxInitialState from './utils/initialState';

it('Renders HotToday component with initialState and correct message', () => {
  render(<HotToday />, { initialState: reduxInitialState });

  expect(screen.getByText('bitcoin')).toBeInTheDocument();
  expect(screen.queryByText('some random text')).not.toBeInTheDocument();
});
