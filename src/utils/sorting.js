export const SORT_TYPES = {
  NORMAL: 1,
  NUMBER: 2,
};

export const handleSort = (a, b, type = SORT_TYPES.NORMAL) => {
  switch (type) {
    case SORT_TYPES.NUMBER:
      if (a > b) {
        return 1;
      } else if (b > a) {
        return -1;
      } else {
        return 0;
      }

    default:
      return a.localeCompare(b);
  }
};

