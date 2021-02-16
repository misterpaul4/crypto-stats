/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { filterCryptos } from '../actions';

const Filter = props => {
  const percentageChange = ['All', '-0.5%', '-0.4%', '-0.2%', '-0.1%', '+0%', '+10%', '+20%', '+30%', '+50%', '+100%'];

  const [localStateDuration, updateDuration] = useState('24h');
  const [filterBy, updateFilter] = useState(percentageChange[0]);

  const onDurationChange = e => {
    updateDuration(e.target.value);
  };

  const onFilterChange = e => {
    updateFilter(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.filterCryptoList({
      filter: filterBy === 'All' ? filterBy : filterBy.substring(filterBy[0] === '+' ? 1 : 0, filterBy.length - 1),
      duration: localStateDuration,
    });
  };

  const Options = pg => (
    <option key={pg}>{pg}</option>
  );

  return (
    <form className="d-flex align-items-center my-3">
      <select onChange={onFilterChange} value={filterBy}>
        {percentageChange.map(Options)}
      </select>

      <div className="radio mx-3">
        <input
          type="radio"
          value="24h"
          className="mr-1"
          checked={localStateDuration === '24h'}
          onChange={onDurationChange}
        />
        24h
      </div>

      <div className="radio mr-3">
        <input
          type="radio"
          value="7d"
          className="mr-1"
          checked={localStateDuration === '7d'}
          onChange={onDurationChange}
        />
        7d
      </div>

      <button type="submit" className="d-flex align-items-center filter-submit-btn" onClick={handleSubmit}>
        <i className="fas fa-exchange-alt mr-1" />
        filter
      </button>
    </form>
  );
};

const mapStateToProps = state => ({
  cryptos: state.cryptos,
  filter: state.filter,
});

const mapDispatchToProps = dispatch => ({
  filterCryptoList: cryptos => {
    dispatch(filterCryptos(cryptos));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
