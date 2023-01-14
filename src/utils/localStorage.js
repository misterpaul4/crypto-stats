export const setLS = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

export const getLs = (key) => JSON.parse(localStorage.getItem(key));

export const LOCAL_STORAGE_KEYS = {
  favourites: "favourites",
  tableSize: "table-size-preference",
  tableBorders: "table-border-preference",
  tableScroll: "table-scroll-preference",
};
