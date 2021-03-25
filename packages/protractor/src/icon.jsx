import React from 'react';
import PropTypes from 'prop-types';

const Icon = ({ className }) => {
  return (
    <svg className={className} width="20px" height="16px" viewBox="0 0 20 16">
      <g>
        <g transform="translate(-2.000000, -2.000000)">
          <path
            d="M16.5,3.66 L16.5,-3.5 C11.5,-3 7.5,1.29 7.5,6.5 C7.5,11.71 11.5,16 16.5,16.5 L16.5,9.34 C15.5,8.93 14.5,7.82 14.5,6.5 C14.5,5.18 15.5,4.07 16.5,3.66 Z"
            fill="#000000"
            fillRule="nonzero"
            transform="translate(12.000000, 6.500000) rotate(-270.000000) translate(-12.000000, -6.500000) "
          />
          <rect fill="#000000" x="2" y="12" width="20" height="6" />
        </g>
      </g>
    </svg>
  );
};
Icon.propTypes = {
  className: PropTypes.string
};

export default Icon;
