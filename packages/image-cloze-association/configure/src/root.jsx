import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

class Root extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.base}>
        Image cloze association
      </div>
    );
  }
}

const styles = theme => ({
  base: {
    marginTop: theme.spacing.unit * 3
  }
});

Root.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Root);
