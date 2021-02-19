import ShallowRenderer from 'react-test-renderer/shallow';
import React from 'react';
import CryptoTableData from '../CryptoTableData';

it('should render Table Data correctly without errors', () => {
  const crypto = {
    market_cap_rank: 1,
    image: 'url',
    name: 'coin',
    current_price: 54,
    price_change_percentage_24h: 58,
    price_change_percentage_7d_in_currency: 60,
    circulating_supply: 50000,
    max_supply: 857,
    market_cap: 87885,
  };

  const render = new ShallowRenderer();

  render.render(<CryptoTableData crypto={crypto} />);
  expect(render.getRenderOutput()).toMatchSnapshot();
});
