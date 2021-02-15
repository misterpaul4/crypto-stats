/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React from 'react';
import { connect } from 'react-redux';
import '../css/chart.css';
import Crypto from '../component/Crypto';
import tooltipIcon from '../img/tooltip.svg';

const Chart = props => {
  const passCrypto = crypto => (<Crypto crypto={crypto} key={crypto.name} />);

  return (
    <table className="chart">
      <thead className="chart-header">
        <tr>
          <td>rank(#)</td>
          <td>name</td>
          <td>price</td>
          <td>7d</td>
          <td>24h</td>
          <td data-toggle="tooltip" data-placement="top" title="number of coins or tokens in circulation currently">
            circ. supply
            <img src={tooltipIcon} alt="icon" className="ml-1" />
          </td>
          <td data-toggle="tooltip" data-placement="top" title="maximum number of coins or tokens that will be ever created">
            total supply
            <img src={tooltipIcon} alt="icon" className="ml-1" />
          </td>
          <td data-toggle="tooltip" data-placement="top" title="market capitalisation is an indicator that measures and keeps track of the market value of a cryptocurrency">
            mrkcap
            <img src={tooltipIcon} alt="icon" className="ml-1" />
          </td>
        </tr>
      </thead>

      <tbody>
        {props.cryptos.cryptos.map(passCrypto)}
      </tbody>
    </table>
  );
};

const mapStateToProps = state => ({
  cryptos: state.cryptos,
});

export default connect(mapStateToProps)(Chart);
