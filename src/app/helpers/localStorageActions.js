import { getLs, LOCAL_STORAGE_KEYS, setLS } from "../../utils/localStorage";

export const addToFavourites = (ids) => {
  const favourites = getLs(LOCAL_STORAGE_KEYS.favourites) || [];

  ids.forEach((id) => {
    if (!favourites.includes(id)) {
      favourites.push(id);
    }
  });

  setLS(LOCAL_STORAGE_KEYS.favourites, favourites);
};

export const removeFromFavourites = (ids) => {
  const favourites = getLs(LOCAL_STORAGE_KEYS.favourites) || [];
  const newFavourites = [];

  ids.forEach((id, index) => {
    if (!favourites.includes(id)) {
      newFavourites.push(id);
    }
  });

  setLS(LOCAL_STORAGE_KEYS.favourites, newFavourites);
};
