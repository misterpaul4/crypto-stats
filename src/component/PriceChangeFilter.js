/* eslint-disable no-console */
import React, { useState } from 'react';

const Filter = () => {
  const percentageChange = ['All', '-15%', '-10%', '-5%', '0%', '+5%', '+10%', '+15%'];

  const [duration, updateDuration] = useState(null);
  const [filterBy, updateFilter] = useState(percentageChange[0]);

  const onDurationChange = e => {
    updateDuration(e.target.value);
  };

  const onFilterChange = e => {
    updateFilter(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log('duration', duration);
    console.log('filter', filterBy);
  };

  const Options = pg => <option key={pg}>{pg}</option>;

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
          checked={duration === '24h'}
          onChange={onDurationChange}
        />
        24h
      </div>

      <div className="radio mr-3">
        <input
          type="radio"
          value="7d"
          className="mr-1"
          checked={duration === '7d'}
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

export default Filter;
