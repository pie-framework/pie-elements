import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Checkbox } from '@pie-lib/config-ui';
import { Divider } from '../design/buttons';

export class Panel extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    onToggleEnabled: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired
  };
  static defaultProps = {};
  render() {
    const {
      classes,
      className,
      children,
      title,
      enabled,
      onToggleEnabled
    } = this.props;
    return (
      <div className={classNames(classes.panel, className)}>
        <div className={classes.header}>
          <Typography variant="title">{title}</Typography>
          <Checkbox
            label="Enabled"
            checked={enabled}
            onChange={onToggleEnabled}
          />
        </div>
        <Divider />
        {children}
      </div>
    );
  }
}
const styles = () => ({
  panel: {},
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
export default withStyles(styles)(Panel);
