/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React from 'react';
import { connect } from 'react-redux';
import '../css/chart.css';
import Crypto from '../component/Crypto';

const Chart = props => {
  const temp = {
    cryptos: [
      {
        rank: 1,
        name: 'dogecoin',
        price: '$0.054',
        d7: '3.2%',
        h24: '5.7%',
        cap: '$600,000',
      },
      {
        rank: 2,
        name: 'bitcoin',
        price: '$47,000',
        d7: '2.28%',
        h24: '15.7%',
        cap: '$600,580,000',
      },
      {
        rank: 3,
        name: 'ripple',
        price: '$0.54',
        d7: '-5.2%',
        h24: '0.7%',
        cap: '$1,600,000',
      },
      {
        rank: 4,
        name: 'etherium',
        price: '$1,800',
        d7: '7.2%',
        h24: '75.7%',
        cap: '$5,600,000',
      },
      {
        rank: 5,
        name: 'monero',
        price: '$154',
        d7: '8.2%',
        h24: '5.7%',
        cap: '$600,000',
      },
      {
        rank: 6,
        name: 'tatcoin',
        price: '$54',
        d7: '60%',
        h24: '51.7%',
        cap: '$60,000',
      },
    ],
  };

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
