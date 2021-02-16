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
      document.body.style.backgroundColor = '#f8f9fa';
      document.body.style.color = '#343a40';
    } else {
      switchToDark();
      document.body.style.backgroundColor = '#343a40';
      document.body.style.color = '#f8f9fa';
    }
  };

  return (
    <button type="button" onClick={handleClick} className="display-mode-btn">
      <img src={darkmode ? dark : light} alt="display preference" className="display-mode" />
    </button>
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
