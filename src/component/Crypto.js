/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import { to2Decimal, toDecimal, moneyWithCommas } from '../utils';

const Crypto = ({
  crypto,
}) => {
  const percentTD = value => (
    <td className={value > '0' ? 'text-success' : 'text-danger'}>
      {to2Decimal(value)}
      %
    </td>
  );

  return (
    <tr className="chart-crypto-row">
      <td>{crypto.market_cap_rank}</td>
      <td>
        <Link to={`/cryptostat/${crypto.id}`}>
          <img src={crypto.image} alt="icon" className="mr-2" />
          {crypto.name}
        </Link>
      </td>
      <td>
        $
        {moneyWithCommas(to2Decimal(crypto.current_price))}
      </td>

      {percentTD(crypto.price_change_percentage_24h)}

      {percentTD(crypto.price_change_percentage_7d_in_currency)}

      <td>{moneyWithCommas(toDecimal(crypto.circulating_supply))}</td>

      <td>{crypto.max_supply ? moneyWithCommas(toDecimal(crypto.max_supply)) : '-'}</td>
      <td>
        $
        {moneyWithCommas(crypto.market_cap)}
      </td>
    </tr>
  );
};
export default Crypto;
