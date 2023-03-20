import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Icon from './icon';
import IconButton from '@material-ui/core/IconButton';
import classNames from 'classnames';

const iconStyles = (theme) => ({
  icon: {
    '& polygon': {
      transition: 'fill 200ms',
      fill: theme.palette.grey[600],
    },
    transition: 'fill 200ms',
    '&:hover': {
      '& polygon': {
        fill: theme.palette.common.black,
      },
    },
    cursor: 'pointer',
    verticalAlign: 'middle',
    fill: theme.palette.grey[600],
  },
  active: {
    '& polygon': {
      fill: theme.palette.common.black,
    },
  },
});

const RawToggle = ({ active, onToggle, classes }) => (
  <IconButton onClick={onToggle}>
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
