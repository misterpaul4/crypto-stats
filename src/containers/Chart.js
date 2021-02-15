/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React from 'react';
import { connect } from 'react-redux';
import '../css/chart.css';
import Crypto from '../component/Crypto';

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
          <td>dummy(7d)</td>
          <td>mrkcap</td>
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
