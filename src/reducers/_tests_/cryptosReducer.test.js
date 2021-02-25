import updateCryptoReducer from '../cryptos';

describe('cryptos reducer', () => {
  let state;

  beforeEach(() => {
    state = [
      { asc: false },
      {
        filter: 'All',
        duration: null,
      },
      { cryptos: {} },
    ];
  });

  it('handle UPDATE_CRYPTO_DATA', () => {
    const cryptos = {
      cryptos: {
        id: 'bitcion',
        symbol: 'btc',
        name: 'Bitcoin',
      },
    };

    const action = {
      type: 'UPDATE_CRYPTO_DATA',
      payload: cryptos,
    };

    const expectedAction = {
      ...state,
      cryptos: action.payload,
    };

    expect(updateCryptoReducer(state, action)).toEqual(expectedAction);
  });

  it('should return the initial state', () => {
    expect(updateCryptoReducer(state, {})).toEqual(state);
  });
});
