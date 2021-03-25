import React from 'react'; //eslint-disable-line
import PropTypes from 'prop-types';

export const basePropTypes = () => ({
  interval: PropTypes.number.isRequired,
  domain: PropTypes.shape({
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired
  })
});
