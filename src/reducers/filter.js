const filterReducer = (state = [], action) => {
  if (action.type === 'CHANGE_FILTER') {
    return {
      ...state,
      filter: action.value,
    };
  }
  return state;
};

export default filterReducer;
