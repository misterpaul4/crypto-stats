import React from 'react';
import { Link } from 'react-router-dom';
import '../css/header.css';

const Header = () => (
  <header className="flex-around">
    <Link to="/" className="flex-centered home">
      <div className="logo bg-img" />
      <span className="logo-name">Crypto Stats</span>
    </Link>
  </header>
);

export default Header;
