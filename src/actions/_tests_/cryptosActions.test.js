import { updateCryptos, filterCryptos, toggleAscSorting } from '../cryptosActions';

describe('crypto actions', () => {
  it('should create an action to update the cryptocurency array', () => {
    const cryptos = {
      cryptos: [
        {
          id: 'bitcion',
          symbol: 'btc',
          name: 'Bitcoin',
        },
      ],
    };
    const expectedAction = {
      type: 'UPDATE_CRYPTO_DATA',
      payload: cryptos,
    };
    expect(updateCryptos(cryptos)).toEqual(expectedAction);
  });

  it('should create an action to filter the cryptocurency array', () => {
    const filter = {
      filter: 'All',
      duration: '7d',
    };

    const expectedAction = {
      type: 'CHANGE_FILTER',
      value: filter,
    };
    expect(filterCryptos(filter)).toEqual(expectedAction);
  });
});

describe('toggling sort order', () => {
  it('should create an action to toggle the sort order', () => {
    const sort = {
      asc: true,
    };
    const expectedAction = {
      type: 'TOGGLE_SORT_ORDER',
    };
    expect(toggleAscSorting(sort)).toEqual(expectedAction);
  });
});
