const updateCryptos = cryptos => ({
  type: 'UPDATE_CRYPTO_DATA',
  payload: cryptos,
});

const filterCryptos = value => ({
  type: 'CHANGE_FILTER',
  value,
});

export { updateCryptos, filterCryptos };
