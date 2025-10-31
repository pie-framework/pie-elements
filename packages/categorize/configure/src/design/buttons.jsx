import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import classNames from 'classnames';
import Button from '@mui/material/Button';
import MuiDivider from '@mui/material/Divider';

export class RawAddButton extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    label: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    label: 'Add',
  };

  render() {
    const { classes, className, label, onClick, disabled } = this.props;
    return (
      <Button
        onClick={onClick}
        disabled={disabled}
        className={classNames(classes.addButton, className)}
        size="small"
        variant="contained"
        color="primary"
      >
        {label}
      </Button>
    );
  }
}
const styles = (theme) => ({
  addButton: {
    height: theme.spacing.unit * 4,
  },
});

const AddButton = withStyles(styles)(RawAddButton);

const DeleteButton = withStyles(() => ({
  deleteButton: {
    margin: 0,
    padding: 0,
  },
}))(({ classes, label, onClick, disabled }) => (
  <Button className={classes.deleteButton} onClick={onClick} size="small" color="primary" disabled={disabled}>
    {label}
  </Button>
));

export { AddButton, DeleteButton };
