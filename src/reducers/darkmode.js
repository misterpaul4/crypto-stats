const darkModeReducer = (state = [], action) => {
  switch (action.type) {
    case 'DARK_MODE_ON':
      return {
        ...state,
        darkmode: true,
      };

    case 'DARK_MODE_OFF':
      return {
        ...state,
        darkmode: false,
      };

    default:
      return state;
  }
};

export default darkModeReducer;
