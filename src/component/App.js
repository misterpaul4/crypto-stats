/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { updateCryptos } from '../actions';
import HotToday from './HotToday';
import Filter from './Filter';
import Chart from '../containers/Chart';

const App = props => {
  useEffect(() => {
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&sparkline=false&price_change_percentage=7d%2C30d';

    fetch(url).then(response => response.json())
      .then(data => {
        props.updateCryptosState(data);
      });

    return null;
  }, []);

  return (
    <div className={props.darkmode ? 'bg-dark text-light' : 'bg-light text-dark'}>
      <div className="main-container container">
        {
        props.cryptos
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
    </div>
  );
};

const mapStateToProps = state => ({
  cryptos: state.cryptos,
  darkmode: state.darkmode.darkmode,
});

const mapDispatchToProps = dispatch => ({
  updateCryptosState: cryptos => {
    dispatch(updateCryptos(cryptos));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
