import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Delete from '@material-ui/icons/Delete';

export class DeleteControl extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onDeleteClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  };

  render() {
    const { classes, disabled, onDeleteClick } = this.props;

    return (
      <Button
        className={classes.button}
        disabled={disabled}
        onClick={onDeleteClick}
      >
        <Delete />
      </Button>
    );
  }
}

const styles = () => ({
  button: {
    margin: 0
  }
});

export default withStyles(styles)(DeleteControl);
