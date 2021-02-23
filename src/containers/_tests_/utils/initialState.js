const reduxInitialState = {
  darkmode: { darkmode: false },
  sort: { asc: false },
  filter: {
    filter: {
      filter: 'All',
      duration: null,
    },
  },
  cryptos: {
    cryptos: [
      {
        name: 'bitcoin',
        price_change_percentage_24h: '-15',
        price_change_percentage_7d_in_currency: '21',
        market_cap_rank: '1',
        current_price: '988585',
        max_supply: '58774899',
        total_supply: '58774899',
        circulating_supply: '45649849',
        market_cap: '45649879645',
      },
      {
        name: 'etherium',
        price_change_percentage_24h: '150',
        price_change_percentage_7d_in_currency: '21',
        market_cap_rank: '2',
        current_price: '988585',
        max_supply: '58774899',
        total_supply: '58774899',
        circulating_supply: '45649849',
        market_cap: '45649879645',
      },
    ],
  },
};

export default reduxInitialState;
