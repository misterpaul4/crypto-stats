import React from 'react';
import { render, screen } from './utils/render';
import CryptoTable from '../CryptoTable';
import '@testing-library/jest-dom';
import reduxInitialState from './utils/initialState';

it('Renders CryptoTable with the initialState and correct message', () => {
  render(<CryptoTable />, { initialState: reduxInitialState });

  expect(screen.getByText('bitcoin')).toBeInTheDocument();
  expect(screen.queryByText('some random text')).not.toBeInTheDocument();
});
