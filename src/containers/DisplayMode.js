import React from 'react';
import light from '../img/light.svg';
import dark from '../img/dark.svg';

const Mode = () => {
  const mode = 'light';

  return (
    <img src={mode === 'dark' ? dark : light} alt="display mode" className="display-mode" />
  );
};

export default Mode;
