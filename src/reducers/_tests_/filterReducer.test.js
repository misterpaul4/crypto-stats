import filterReducer from '../filter';

describe('filter reducer', () => {
  let state;

  beforeEach(() => {
    state = [
      { asc: false },
      { cryptos: 'bitcoin' },
      {
        filter: 'All',
        duration: null,
      },
    ];
  });

  it('handle CHANGE_FILTER', () => {
    const action = {
      type: 'CHANGE_FILTER',
      value: '15',
    };

    const expectedAction = {
      ...state,
      filter: '15',
    };

    expect(filterReducer(state, action)).toEqual(expectedAction);
  });

  it('should return the initial state', () => {
    expect(filterReducer(state, {})).toEqual(state);
  });
});
