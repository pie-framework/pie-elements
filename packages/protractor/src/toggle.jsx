import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Icon from './icon';
import IconButton from '@mui/material/IconButton';

const StyledIcon = styled(Icon)(({ theme, active }) => ({
  '& path': {
    transition: 'fill 200ms',
    fill: active ? theme.palette.common.black : theme.palette.grey[600],
  },
  '& rect': {
    transition: 'fill 200ms',
    fill: active ? theme.palette.common.black : theme.palette.grey[600],
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
}));

const Toggle = ({ active, onToggle }) => (
  <IconButton onClick={onToggle} size="large">
    <StyledIcon active={active} />
  </IconButton>
);

Toggle.propTypes = {
  active: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default Toggle;
