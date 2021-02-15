/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';

const Crypto = props => {
  const to2Decimal = value => parseFloat(value).toFixed(2);

  const percentTD = value => (
    <td className={value > '0' ? 'text-success' : 'text-danger'}>
      {to2Decimal(value)}
      %
    </td>
  );

  const moneyWithCommas = amount => amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <tr className="chart-crypto-row">
      <td>{props.crypto.market_cap_rank}</td>
      <td>
        <img src={props.crypto.image} alt="icon" className="mr-2" />
        {props.crypto.name}
      </td>
      <td>
        $
        {moneyWithCommas(to2Decimal(props.crypto.current_price))}
      </td>

      {percentTD(props.crypto.price_change_percentage_7d_in_currency)}
      {percentTD(props.crypto.price_change_percentage_24h)}

      <td>$100 7days ago</td>
      <td>
        $
        {moneyWithCommas(props.crypto.market_cap)}
      </td>
    </tr>
  );
};
export default Crypto;
