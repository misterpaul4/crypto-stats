import React from 'react';
import { render, screen } from './utils/render';
import CryptoPage from '../CryptoPage';
import '@testing-library/jest-dom';

it('Renders the crypto page correctly', () => {
  render(<CryptoPage />);

  expect(screen.getAllByText('...loading')[0]).toBeInTheDocument();
  expect(screen.queryByText('some random text')).not.toBeInTheDocument();
});
