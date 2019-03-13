import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import MuiDivider from '@material-ui/core/Divider';

export class RawAddButton extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    label: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    label: 'Add'
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
const styles = theme => ({
  addButton: {
    height: theme.spacing.unit * 4
  }
});

const AddButton = withStyles(styles)(RawAddButton);

const DeleteButton = withStyles(theme => ({
  deleteButton: {
    margin: 0,
    padding: 0
  }
}))(({ classes, label, onClick }) => (
  <Button
    className={classes.deleteButton}
    onClick={onClick}
    size="small"
    color="primary"
  >
    {label}
  </Button>
));

const Divider = withStyles(theme => ({
  divider: {
    marginTop: 2 * theme.spacing.unit,
    marginBottom: 2 * theme.spacing.unit
  }
}))(({ classes }) => <MuiDivider className={classes.divider} />);

export { AddButton, DeleteButton, Divider };
