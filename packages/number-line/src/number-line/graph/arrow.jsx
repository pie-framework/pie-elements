import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { color } from '@pie-lib/render-ui';

const StyledPath = styled('path')({
  fill: color.primary(),
});

export function Arrow({ x, y, direction, className }) {
  let transform = `translate(${x || 0},${y})`;

  if (direction && direction === 'right') {
    transform += ' rotate(180)';
  }

  return <StyledPath d="m 0,0 8,-5 0,10 -8,-5" transform={transform} className={className} />;
}

Arrow.propTypes = {
  y: PropTypes.number,
  x: PropTypes.number,
  direction: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
};

Arrow.defaultProps = {
  y: 0,
  x: 0,
  direction: 'left',
};

export default Arrow;
