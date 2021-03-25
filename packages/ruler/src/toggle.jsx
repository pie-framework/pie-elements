import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Icon from './icon';
import IconButton from '@material-ui/core/IconButton';
import classNames from 'classnames';

const iconStyles = {
  icon: {
    '& polygon': {
      transition: 'fill 200ms',
      fill: 'grey'
    },
    transition: 'fill 200ms',
    '&:hover': {
      '& polygon': {
        fill: 'black'
      }
    },
    cursor: 'pointer',
    verticalAlign: 'middle',
    fill: 'grey'
  },
  active: {
    '& polygon': {
      fill: 'black'
    }
  }
};

const RawToggle = ({ active, onToggle, classes }) => (
  <IconButton onClick={onToggle}>
    <Icon className={classNames(classes.icon, active && classes.active)} />
  </IconButton>
);

RawToggle.propTypes = {
  active: PropTypes.bool,
  onToggle: PropTypes.func,
  classes: PropTypes.object
};
const Toggle = withStyles(iconStyles)(RawToggle);
export default Toggle;
