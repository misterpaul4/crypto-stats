import darkModeReducer from '../darkmode';

describe('darkmode reducer', () => {
  let state;

  beforeEach(() => {
    state = [
      {
        id: 'bitcoin',
        name: 'Bitcoin',
      },
    ];
  });

  it('should handle DARK_MODE_ON', () => {
    const action = {
      type: 'DARK_MODE_ON',
    };

    const expectedAction = {
      ...state,
      darkmode: true,
    };

    expect(darkModeReducer(state, action)).toEqual(expectedAction);
  });

  it('should handle DARK_MODE_OFF', () => {
    const action = {
      type: 'DARK_MODE_OFF',
    };

    const expectedAction = {
      ...state,
      darkmode: false,
    };

    expect(darkModeReducer(state, action)).toEqual(expectedAction);
  });

  it('should return the initial state', () => {
    expect(darkModeReducer(state, {})).toEqual(state);
  });
});
