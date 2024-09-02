import { NumberTextField as NTF } from '@pie-lib/pie-toolbox/config-ui';
import PropTypes from 'prop-types';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';

export class NumberTextField extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { classes } = this.props;
    const props = { ...this.props, classes: undefined };
    return <NTF {...props} className={cn(classes.textField, props.className)} variant="outlined" />;
  }
}

const styles = (theme) => ({
  textField: {
    marginLeft: theme.spacing.unit,
  },
});

const miniStyles = () => ({
  textField: {
    maxWidth: '120px',
    width: '120px',
    marginTop: '0',
    '& [class^="MuiInputBase-root"]': {
      height: 40,
      fontSize: '0.875rem',
    },
  },
  
});
export const MiniField = withStyles(miniStyles)(NumberTextField);

export default withStyles(styles)(NumberTextField);
