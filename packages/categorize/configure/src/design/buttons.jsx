import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const StyledAddButton = styled(Button)(({ theme }) => ({
  height: theme.spacing(4),
}));

export class RawAddButton extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    label: 'Add',
  };

  render() {
    const { label, onClick, disabled } = this.props;
    return (
      <StyledAddButton
        onClick={onClick}
        disabled={disabled}
        size="small"
        variant="contained"
        color="primary"
      >
        {label}
      </StyledAddButton>
    );
  }
}

const AddButton = RawAddButton;

const StyledDeleteButton = styled(Button)({
  margin: 0,
  padding: 0,
});

const DeleteButton = ({ label, onClick, disabled }) => (
  <StyledDeleteButton onClick={onClick} size="small" color="primary" disabled={disabled}>
    {label}
  </StyledDeleteButton>
);

export { AddButton, DeleteButton };
