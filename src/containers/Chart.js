/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import '../css/chart.css';
import Crypto from '../component/Crypto';

const Chart = ({
  cryptos: { cryptos },
  filter: { filter },
}) => {
  const passCrypto = crypto => (<Crypto crypto={crypto} key={crypto.name} />);

  const filteredCryptos = () => {
    if (filter.filter !== 'All') {
      if (filter.duration === '24h') {
        return cryptos.filter(crypto => crypto.price_change_percentage_24h >= filter.filter);
      }
      // eslint-disable-next-line max-len
      return cryptos.filter(crypto => crypto.price_change_percentage_7d_in_currency >= filter.filter);
    }
    return cryptos;
  };

  return (
    <table className="chart">
      <thead className="chart-header">
        <tr>
          <td>rank(#)</td>
          <td>name</td>
          <td>price</td>
          <td>24h</td>
          <td>7d</td>
          <td data-toggle="tooltip" data-placement="top" title="number of coins or tokens in circulation currently">
            circ. supply
            <i className="fas fa-info-circle ml-1" />
          </td>
          <td data-toggle="tooltip" data-placement="top" title="maximum number of coins or tokens that will be ever created">
            total supply
            <i className="fas fa-info-circle ml-1" />
          </td>
          <td data-toggle="tooltip" data-placement="top" title="market capitalisation is an indicator that measures and keeps track of the market value of a cryptocurrency">
            mrkcap
            <i className="fas fa-info-circle ml-1" />
          </td>
        </tr>
      </thead>

      <tbody>
        {filteredCryptos().map(passCrypto)}
      </tbody>
    </table>
  );
};

const mapStateToProps = state => ({
  cryptos: state.cryptos,
  filter: state.filter,
});

export default connect(mapStateToProps)(Chart);
