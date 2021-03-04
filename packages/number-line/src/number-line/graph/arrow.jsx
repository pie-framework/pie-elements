import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import injectSheet from 'react-jss';
import { color } from '@pie-lib/render-ui';

const style = {
  root: {
    fill: color.primary()
  }
};

export function Arrow({ x, y, direction, classes, className }) {
  let transform = `translate(${x || 0},${y})`;

  if (direction && direction === 'right') {
    transform += ' rotate(180)';
  }

  const names = classNames(classes.root, className);
  return (
    <path d="m 0,0 8,-5 0,10 -8,-5" transform={transform} className={names} />
  );
}

Arrow.propTypes = {
  y: PropTypes.number,
  x: PropTypes.number,
  direction: PropTypes.oneOf(['left', 'right']),
  classes: PropTypes.object.isRequired,
  className: PropTypes.string
};

Arrow.defaultProps = {
  y: 0,
  x: 0,
  direction: 'left'
};

export default injectSheet(style)(Arrow);
