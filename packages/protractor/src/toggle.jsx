import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import Icon from './icon';
import IconButton from '@mui/material/IconButton';
import classNames from 'classnames';

const iconStyles = (theme) => ({
  icon: {
    '& path': {
      transition: 'fill 200ms',
      fill: theme.palette.grey[600],
    },
    '& rect': {
      transition: 'fill 200ms',
      fill: theme.palette.grey[600],
    },
    transition: 'fill 200ms',
    '&:hover': {
      '& path': {
        fill: theme.palette.common.black,
      },
      '& rect': {
        fill: theme.palette.common.black,
      },
    },
    cursor: 'pointer',
    verticalAlign: 'middle',
    fill: theme.palette.grey[600],
  },
  active: {
    '& path': {
      fill: theme.palette.common.black,
    },
    '& rect': {
      fill: theme.palette.common.black,
    },
  },
});

const RawToggle = ({ active, onToggle, classes }) => (
  <IconButton onClick={onToggle} size="large">
    <Icon className={classNames(classes.icon, active && classes.active)} />
  </IconButton>
);

RawToggle.propTypes = {
  active: PropTypes.bool,
  onToggle: PropTypes.func,
  classes: PropTypes.object,
};
const Toggle = withStyles(iconStyles)(RawToggle);
export default Toggle;
