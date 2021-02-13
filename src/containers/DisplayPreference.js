/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { darkMode, lightMode } from '../actions';
import light from '../img/light.svg';
import dark from '../img/dark.svg';

const DisplayPreference = ({
  darkmode: { darkmode },
  switchToDark,
  switchToLight,
}) => {
  const handleClick = () => {
    if (darkmode) {
      switchToLight();
    } else {
      switchToDark();
    }
  };

  return (
    <img src={darkmode ? dark : light} alt="display preference" className="display-mode" onClick={handleClick} />
  );
};

const mapStateToProps = state => ({
  darkmode: state.darkmode,
});

const mapDispatchToProps = dispatch => ({
  switchToDark: preference => {
    dispatch(darkMode(preference));
  },
  switchToLight: preference => {
    dispatch(lightMode(preference));
  },
});

DisplayPreference.propTypes = {
  darkmode: PropTypes.shape({
    darkmode: PropTypes.bool.isRequired,
  }).isRequired,
  switchToDark: PropTypes.func.isRequired,
  switchToLight: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(DisplayPreference);
