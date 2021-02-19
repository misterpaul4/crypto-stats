import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import '../css/chart.css';
import CryptoTableData from '../component/CryptoTableData';
import { updateCryptos, toggleAscSorting } from '../actions';

const Chart = ({
  cryptos: { cryptos },
  filter: { filter },
  asc: { asc },
  updateCryptosState,
  toggleSortOrder,
}) => {
  const passCrypto = crypto => (<CryptoTableData crypto={crypto} key={crypto.name} />);

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

  const sortBy = key => {
    const compare = (a, b) => {
      if (a[key] < b[key]) {
        return asc ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return asc ? 1 : -1;
      }

      return 0;
    };
    toggleSortOrder();
    updateCryptosState(cryptos.sort(compare));
  };

  return (
    <table className="chart">
      <thead className="chart-header">
        <tr>
          <td><button type="button" onClick={() => sortBy('market_cap_rank')}>rank(#)</button></td>
          <td><button type="button" onClick={() => sortBy('name')}>name</button></td>
          <td><button type="button" onClick={() => sortBy('current_price')}>price</button></td>
          <td><button type="button" onClick={() => sortBy('price_change_percentage_24h')}>24h</button></td>
          <td><button type="button" onClick={() => sortBy('price_change_percentage_7d_in_currency')}>7d</button></td>
          <td data-toggle="tooltip" data-placement="top" title="number of coins or tokens in circulation currently">
            circ. supply
            <i className="fas fa-info-circle ml-1" />
          </td>
          <td data-toggle="tooltip" data-placement="top" title="maximum number of coins or tokens that will be ever created">
            total supply
            <i className="fas fa-info-circle ml-1" />
          </td>
          <td data-toggle="tooltip" data-placement="top" title="market capitalisation is an indicator that measures and keeps track of the market value of a cryptocurrency">
            <button type="button" onClick={() => sortBy('market_cap_rank')}>mrkcap</button>
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
  asc: state.sort,
});

const mapDispatchToProps = dispatch => ({
  updateCryptosState: cryptos => {
    dispatch(updateCryptos(cryptos));
  },
  toggleSortOrder: () => dispatch(toggleAscSorting()),
});

Chart.propTypes = {
  cryptos: propTypes.shape(propTypes.shape({
    cryptos: propTypes.string,
  }).isRequired).isRequired,

  filter: propTypes.shape(propTypes.shape({
    filter: propTypes.string.isRequired,
  }).isRequired).isRequired,

  asc: propTypes.shape({
    asc: propTypes.bool.isRequired,
  }).isRequired,

  updateCryptosState: propTypes.func.isRequired,
  toggleSortOrder: propTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
