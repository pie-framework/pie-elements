import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const StyledButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const RawButton = ({ className, label, onClick, disabled }) => (
  <StyledButton
    onClick={onClick}
    disabled={disabled}
    className={className}
    size="small"
    variant="contained">
    {label}
  </StyledButton>
);

RawButton.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func,
};

RawButton.defaultProps = {
  className: '',
  disabled: false,
  label: 'Add',
  onClick: () => {},
};

export default RawButton;
