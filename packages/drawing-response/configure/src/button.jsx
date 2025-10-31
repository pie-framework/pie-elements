import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import classNames from 'classnames';
import Button from '@mui/material/Button';

const RawButton = ({ classes, className, label, onClick, disabled }) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    className={classNames(classes.addButton, className)}
    size="small"
    variant="contained">
    {label}
  </Button>
);

RawButton.propTypes = {
  classes: PropTypes.object.isRequired,
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

const styles = () => ({
  addButton: {
    marginLeft: 8,
  },
});

const ButtonStyled = withStyles(styles)(RawButton);

export default ButtonStyled;
