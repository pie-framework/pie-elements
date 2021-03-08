import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@mdi/react';
import {
  mdiCursorDefault,
  mdiPencil,
  mdiMinus,
  mdiRectangle,
  mdiCircle,
  mdiFormatColorText,
  mdiFormatColorFill,
  mdiEraser
} from '@mdi/js';

const IconWrapper = ({ path }) => {
  let iconPath;

  switch (path) {
    case 'mdiPencil':
      iconPath = mdiPencil; break;
    case 'mdiMinus':
      iconPath = mdiMinus; break;
    case 'mdiCircle':
      iconPath = mdiCircle; break;
    case 'mdiRectangle':
      iconPath = mdiRectangle; break;
    case 'mdiFormatColorText':
      iconPath = mdiFormatColorText; break;
    case 'mdiFormatColorFill':
      iconPath = mdiFormatColorFill; break;
    case 'mdiEraser':
      iconPath = mdiEraser; break;
    default:
      iconPath = mdiCursorDefault; break;
  }

  return (
    <Icon
      path={iconPath}
      size={0.8}
      rotate={180}
      horizontal
      vertical
      color="#2B3963"
    />
  )
};

IconWrapper.propTypes = {
  path: PropTypes.string.isRequired
};

export default IconWrapper;
