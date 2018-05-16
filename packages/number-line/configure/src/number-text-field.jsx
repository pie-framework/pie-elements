import { NumberTextField as NTF } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';

export class NumberTextField extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  render() {
    const { classes } = this.props;
    const props = { ...this.props, classes: undefined };
    return <NTF {...props} className={classes.textField} />;
  }
}

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit
  }
});

export default withStyles(styles)(NumberTextField);
