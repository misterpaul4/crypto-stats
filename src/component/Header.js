import React from 'react';
import { Link } from 'react-router-dom';
import '../css/header.css';
import DisplayPreference from '../containers/DisplayPreference';

const Header = () => (
  <header className="flex-between">
    <Link to="/" className="flex-centered home">
      <div className="logo bg-img" />
      <span className="logo-name">Crypto Stats</span>
    </Link>

    <DisplayPreference />
  </header>
);

export default Header;
