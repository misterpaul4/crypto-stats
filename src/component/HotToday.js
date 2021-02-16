import React from 'react';
import '../css/hotToday.css';

const HotToday = () => (
  <div className="d-inline-block p-3 my-3 today-view mb-3">
    <h1>Today</h1>
    <p>
      hottest crypto of the day is
      <span> dogecoin</span>
      , It is up
      <span> 5%</span>
    </p>
    <p>
      <span>etherium</span>
      {' '}
      is currently down
      {' '}
      <span>-15%</span>
    </p>
  </div>
);

export default HotToday;
