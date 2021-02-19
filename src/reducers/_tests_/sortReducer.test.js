import sortReducer from '../sort';

describe('sort reducer', () => {
  let state;

  beforeEach(() => {
    state = [
      { asc: false },
      { cryptos: 'bitcoin' },
    ];
  });

  it('should handle TOGGLE_SORT_ORDER', () => {
    const action = {
      type: 'TOGGLE_SORT_ORDER',
    };

    const expectedAction = {
      ...state,
      asc: true,
    };

    expect(sortReducer(state, action)).toEqual(expectedAction);
  });

  it('should return the initial state', () => {
    expect(sortReducer(state, {})).toEqual(state);
  });
});
