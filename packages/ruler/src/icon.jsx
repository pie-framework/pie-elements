import React from 'react';
import PropTypes from 'prop-types';

const Icon = ({ className }) => (
  <svg className={className} width="24px" height="24px" viewBox="0 0 24 24">
    <polygon points="22 12 18 8 18 11 6 11 6 8 2 12 6 16 6 13 18 13 18 16 22 12" />
  </svg>
);
Icon.propTypes = {
  className: PropTypes.string
};

export default Icon;
