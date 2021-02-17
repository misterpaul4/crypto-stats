/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { updateCryptos } from '../actions';
import HotToday from './HotToday';
import Filter from './Filter';
import Chart from '../containers/Chart';

const App = ({
  cryptos,
  updateCryptosState,
}) => {
  useEffect(() => {
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&sparkline=false&price_change_percentage=24h%2C7d';

    fetch(url).then(response => response.json())
      .then(data => {
        updateCryptosState(data);
      });

    return null;
  }, []);

  return (
    <div className="main-container container">
      {
        cryptos
          ? (
            <>
              <HotToday />
              <Filter />
              <Chart />
            </>
          )
          : <span>...loading</span>
      }
    </div>
  );
};

const mapStateToProps = state => ({
  cryptos: state.cryptos,
});

const mapDispatchToProps = dispatch => ({
  updateCryptosState: cryptos => {
    dispatch(updateCryptos(cryptos));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
