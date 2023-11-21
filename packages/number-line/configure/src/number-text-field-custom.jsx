import { NumberTextFieldCustom as NTFC } from '@pie-lib/pie-toolbox/config-ui';
import PropTypes from 'prop-types';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';

export class NumberTextFieldCustom extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { classes } = this.props;
    const props = { ...this.props, classes: undefined };
    return <NTFC {...props} className={cn(classes.textField, props.className)} variant="outlined" />;
  }
}

const styles = (theme) => ({
  textField: {
    marginLeft: theme.spacing.unit,
  },
});

const miniStyles = () => ({
  textField: {
    maxWidth: '135px',
  },
});
export const MiniField = withStyles(miniStyles)(NumberTextFieldCustom);

export default withStyles(styles)(NumberTextFieldCustom);
