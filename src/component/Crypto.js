/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';

const Crypto = props => (
  <tr className="chart-crypto-row">
    <td>{props.crypto.market_cap_rank}</td>
    <td>{props.crypto.name}</td>
    <td>
      $
      {props.crypto.current_price}
    </td>
    <td>
      {props.crypto.price_change_percentage_7d_in_currency}
      %
    </td>
    <td>
      {props.crypto.price_change_percentage_24h}
      %
    </td>
    <td>$100 7days ago</td>
    <td>
      $
      {props.crypto.market_cap}
    </td>
  </tr>
);

export default Crypto;
