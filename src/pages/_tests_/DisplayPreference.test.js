import React from 'react';
import { render, screen } from './utils/render';
import DisplayPreference from '../DisplayPreference';
import '@testing-library/jest-dom';
import reduxInitialState from './utils/initialState';

it('Renders Display Preference with initialState and correct alt image attribute', () => {
  render(<DisplayPreference />, { initialState: reduxInitialState });

  expect(screen.getByAltText('display preference')).toBeInTheDocument();
  expect(screen.queryByAltText('some random text')).not.toBeInTheDocument();
});
