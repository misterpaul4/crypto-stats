const sortReducer = (state = [], action) => {
  switch (action.type) {
    case 'TOGGLE_SORT_ORDER':
      return {
        ...state,
        asc: !state.asc,
      };

    default:
      return state;
  }
};

export default sortReducer;
