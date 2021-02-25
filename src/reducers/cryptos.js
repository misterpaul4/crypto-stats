const updateCryptoReducer = (state = null, action) => {
  switch (action.type) {
    case 'UPDATE_CRYPTO_DATA':
      return {
        ...state,
        cryptos: action.payload,
      };

    default:
      return state;
  }
};

export default updateCryptoReducer;
