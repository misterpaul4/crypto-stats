export const ALL_TOKENS =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&sparkline=false&price_change_percentage=24h%2C7d";

export const CRYPTO_DETAILS = (id) =>
  `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false`;

export const FAVOURITE_TOKENS = (favourites = []) => {
  const ids = favourites.join(",");
  return `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=250&sparkline=false&price_change_percentage=24h%2C7d`;
};
