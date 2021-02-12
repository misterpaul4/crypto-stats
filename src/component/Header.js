import React from 'react';
import { Link } from 'react-router-dom';
import '../css/header.css';
import DisplayMode from '../containers/DisplayMode';

const Header = () => (
  <header className="flex-between">
    <Link to="/" className="flex-centered home">
      <div className="logo bg-img" />
      <span className="logo-name">Crypto Stats</span>
    </Link>

    <DisplayMode />
  </header>
);

export default Header;
