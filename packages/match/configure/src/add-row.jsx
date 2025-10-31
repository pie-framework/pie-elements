import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import withStyles from '@mui/styles/withStyles';
import AddButton from '@mui/icons-material/Add';

export class AddRowButton extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onAddClick: PropTypes.func.isRequired,
  };

  render() {
    const { classes, onAddClick } = this.props;

    return (
      <Button className={classes.button} disabled={false} onClick={onAddClick}>
        <AddButton className={classes.icon} />
        Add Another Row
      </Button>
    );
  }
}

const styles = (theme) => ({
  button: {
    display: 'flex',
    alignSelf: 'flex-start',
    margin: 0,
  },
  icon: {
    marginRight: theme.spacing.unit / 2,
  },
});

export default withStyles(styles)(AddRowButton);
