import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const StyledButton = styled(Button)({
  fontSize: '0.9em',
  marginLeft: 8,
  minWidth: 32,
  height: 32,
  '& span': {
    '& svg': {
      width: '1.3em !important',
      height: '1.3em !important',
    },
  },
});

const RawButton = ({ label, onClick, disabled, title }) => (
  <StyledButton
    title={title}
    onClick={onClick}
    disabled={disabled}
    size="small"
    variant="contained">
    {label}
  </StyledButton>
);

RawButton.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onClick: PropTypes.func,
  title: PropTypes.string,
};

RawButton.defaultProps = {
  disabled: false,
  label: 'Add',
  onClick: () => {},
  title: '',
};

export default RawButton;
