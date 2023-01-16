// EXCHANGES
export const columnNames = {
  name: "Name",
  "Trust Score": "Trust Score",
  "Trading Volumn": "Trading Volumn",
  "Established On": "Established On",
  Country: "Country",
  Website: "Website",
  "Has trading incentive": "Has trading incentive",
};

export const hiddenColumns = [];

export const visibleColumns = [
  columnNames.name,
  columnNames["Trust Score"],
  columnNames["Trading Volumn"],
  columnNames["Established On"],
  columnNames.Country,
  columnNames.Website,
  columnNames["Has trading incentive"],
];

// DERIVATIVES
export const derivativeColumnNames = {
  name: "Name",
  open_interest_btc: "Open Interest",
  "Trading Volumn": "Trading Volumn",
  number_of_perpetual_pairs: "Perpetual pairs",
  number_of_futures_pairs: "Futures pairs",
  "Established On": "Established On",
  Country: "Country",
  Website: "Website",
};

export const derivativeHiddenColumns = [];

export const derivativeVisibleColumns = [
  derivativeColumnNames.name,
  derivativeColumnNames.open_interest_btc,
  derivativeColumnNames["Trading Volumn"],
  derivativeColumnNames.number_of_perpetual_pairs,
  derivativeColumnNames.number_of_futures_pairs,
  derivativeColumnNames["Established On"],
  derivativeColumnNames.Country,
  derivativeColumnNames.Website,
];
