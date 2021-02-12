const displayModeReducer = (state = 'light', action) => {
  switch (action.type) {
    case 'DARK_MODE':
      return {
        ...state,
        display: 'dark',
      };

    case 'LIGHT_MODE':
      return {
        ...state,
        display: 'light',
      };

    default:
      return state;
  }
};

export default displayModeReducer;
