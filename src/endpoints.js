const BASE_URL = "https://api.coingecko.com/api/v3/";

export const ALL_TOKENS = `${BASE_URL}coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&sparkline=false&price_change_percentage=24h%2C7d`;

export const CRYPTO_DETAILS = (id) =>
  `${BASE_URL}coins/${id}?localization=false&tickers=false&market_data=true&community_data=false`;

export const FAVOURITE_TOKENS = (favourites = []) => {
  const ids = favourites.join(",");
  return `${BASE_URL}coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=250&sparkline=false&price_change_percentage=24h%2C7d`;
};

export const EXCHANGES = `${BASE_URL}exchanges?per_page=250`;

export const DERIVATIVES = `${BASE_URL}derivatives/exchanges`;
