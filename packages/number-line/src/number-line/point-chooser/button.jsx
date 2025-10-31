import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import classNames from 'classnames';
import Button from '@mui/material/Button';

const RawButton = ({ classes, className, label, onClick, disabled, title }) => (
  <Button
    title={title}
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
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onClick: PropTypes.func,
  title: PropTypes.string,
};

RawButton.defaultProps = {
  className: '',
  disabled: false,
  label: 'Add',
  onClick: () => {},
  title: '',
};

const styles = () => ({
  addButton: {
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
  },
});

const ButtonStyled = withStyles(styles)(RawButton);

export default ButtonStyled;
