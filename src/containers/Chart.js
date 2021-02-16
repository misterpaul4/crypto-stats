/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import '../css/chart.css';
import Crypto from '../component/Crypto';
import { updateCryptos } from '../actions';

const Chart = ({
  cryptos: { cryptos },
  filter: { filter },
  updateCryptosState,
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

  const sortDerfault = () => {
    const compareMarketRank = (a, b) => {
      if (a.market_cap_rank < b.market_cap_rank) {
        return -1;
      }
      if (a.market_cap_rank > b.market_cap_rank) {
        return 1;
      }

      return 0;
    };
    updateCryptosState(cryptos.sort(compareMarketRank));
  };

  const sortByName = () => {
    const compareName = (a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }

      return 0;
    };
    updateCryptosState(cryptos.sort(compareName));
  };

  const sortByPrice = () => {
    const comparePrice = (a, b) => {
      if (a.current_price < b.current_price) {
        return -1;
      }
      if (a.current_price > b.current_price) {
        return 1;
      }

      return 0;
    };
    updateCryptosState(cryptos.sort(comparePrice));
  };

  const sortBy24h = () => {
    const compare24h = (a, b) => {
      if (a.price_change_percentage_24h < b.price_change_percentage_24h) {
        return -1;
      }
      if (a.price_change_percentage_24h > b.price_change_percentage_24h) {
        return 1;
      }

      return 0;
    };
    updateCryptosState(cryptos.sort(compare24h));
  };

  const sortBy7d = () => {
    const compare7d = (a, b) => {
      if (a.price_change_percentage_7d_in_currency < b.price_change_percentage_7d_in_currency) {
        return -1;
      }
      if (a.price_change_percentage_7d_in_currency > b.price_change_percentage_7d_in_currency) {
        return 1;
      }

      return 0;
    };
    updateCryptosState(cryptos.sort(compare7d));
  };

  return (
    <table className="chart">
      <thead className="chart-header">
        <tr>
          <td><button type="button" onClick={sortDerfault}>rank(#)</button></td>
          <td><button type="button" onClick={sortByName}>name</button></td>
          <td><button type="button" onClick={sortByPrice}>price</button></td>
          <td><button type="button" onClick={sortBy24h}>24h</button></td>
          <td><button type="button" onClick={sortBy7d}>7d</button></td>
          <td data-toggle="tooltip" data-placement="top" title="number of coins or tokens in circulation currently">
            circ. supply
            <i className="fas fa-info-circle ml-1" />
          </td>
          <td data-toggle="tooltip" data-placement="top" title="maximum number of coins or tokens that will be ever created">
            total supply
            <i className="fas fa-info-circle ml-1" />
          </td>
          <td data-toggle="tooltip" data-placement="top" title="market capitalisation is an indicator that measures and keeps track of the market value of a cryptocurrency">
            <button type="button" onClick={sortDerfault}>mrkcap</button>
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

const mapDispatchToProps = dispatch => ({
  updateCryptosState: cryptos => {
    dispatch(updateCryptos(cryptos));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
