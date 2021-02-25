import React from 'react';
import Filter from '../Filter';
import { render, screen } from './utils/render';
import '@testing-library/jest-dom';

it('should render Filter component correctly without errors', () => {
  render(<Filter />);
  expect(screen.getByText('24h')).toBeInTheDocument();
  expect(screen.queryByText('some random text')).not.toBeInTheDocument();
});
