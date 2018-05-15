import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';

export class Design extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string
  };
  static defaultProps = {};
  render() {
    const { classes, className } = this.props;
    return <div className={classNames(classes.design, className)} />;
  }
}
const styles = theme => ({
  design: {}
});
export default withStyles(styles)(Design);
