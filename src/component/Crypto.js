/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';

const Crypto = props => (
  <tr className="chart-crypto-row">
    <td>{props.crypto.rank}</td>
    <td>{props.crypto.name}</td>
    <td>{props.crypto.price}</td>
    <td>{props.crypto.d7}</td>
    <td>{props.crypto.h24}</td>
    <td>(price + (d7 x price)) x $100</td>
    <td>{props.crypto.cap}</td>
  </tr>
);

export default Crypto;
