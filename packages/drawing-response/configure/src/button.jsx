import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const StyledButton = styled(Button)({
  marginLeft: 8,
});

const CustomButton = ({ label, onClick, disabled }) => (
  <StyledButton
    onClick={onClick}
    disabled={disabled}
    size="small"
    variant="contained">
    {label}
  </StyledButton>
);

CustomButton.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func,
};

CustomButton.defaultProps = {
  className: '',
  disabled: false,
  label: 'Add',
  onClick: () => { },
};

export default CustomButton;
