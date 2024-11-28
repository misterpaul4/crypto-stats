export const PATHS = {
  home: "/",
  favourites: "/favourites",
  exchanges: "/exchanges",
  cryptoDetails: (id = ":id") => `/cryptocurrency/${id}`,
};
