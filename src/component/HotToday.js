/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { to2Decimal } from '../utils';
import '../css/hotToday.css';

const HotToday = ({
  cryptos: { cryptos },
}) => {
  const compare = (a, b) => {
    if (a.price_change_percentage_24h < b.price_change_percentage_24h) {
      return -1;
    }
    if (a.price_change_percentage_24h > b.price_change_percentage_24h) {
      return 1;
    }

    return 0;
  };

  const cryptosCopy = _.cloneDeep(cryptos);
  const sorted = cryptosCopy.sort(compare);
  const hottest = sorted[sorted.length - 1];
  const lowest = sorted[0];

  return (
    <div className="d-inline-block p-3 my-3 today-view mb-3">
      <h1>Today</h1>
      <p>
        hottest crypto of the day is
        <span>
          {' '}
          {hottest.name}
        </span>
        , It is up
        <span>
          {' '}
          {to2Decimal(hottest.price_change_percentage_24h)}
          %
        </span>
      </p>
      <p>
        worst performer of the day is
        <span>
          {' '}
          {lowest.name}
        </span>
        , it is currently down
        {' '}
        <span>
          {to2Decimal(lowest.price_change_percentage_24h)}
          %
        </span>
      </p>
    </div>
  );
};

const mapStateToProps = state => ({
  cryptos: state.cryptos,
});

export default connect(mapStateToProps)(HotToday);
