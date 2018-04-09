import React from 'react';
import { withStyles } from 'material-ui/styles';

const Box = withStyles(theme => ({
  box: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
}))(({ classes, children }) => (<div className={classes.box}>{children}</div>))

export default Box;