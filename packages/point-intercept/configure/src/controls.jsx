import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Delete from 'material-ui-icons/Delete';

export class Controls extends React.Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    onDeleteClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  };

  render() {
    const { classes, disabled, onDeleteClick } = this.props;

    return (<div>
      <Button
        className={classes.button}
        color="primary"
        disabled={disabled}
        onClick={onDeleteClick} >
        Delete
        <Delete className={classes.rightIcon} />
      </Button>
    </div>);
  }
}

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  }
});

export default withStyles(styles)(Controls);
