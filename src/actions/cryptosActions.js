const updateCryptos = cryptos => ({
  type: 'UPDATE_CRYPTO_DATA',
  payload: cryptos,
});

const filterCryptos = value => ({
  type: 'CHANGE_FILTER',
  value,
});

const toggleAscSorting = () => ({
  type: 'TOGGLE_SORT_ORDER',
});

export { updateCryptos, filterCryptos, toggleAscSorting };
