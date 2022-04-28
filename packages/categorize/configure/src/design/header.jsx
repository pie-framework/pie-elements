import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { AddButton } from './buttons';

export class Header extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    buttonLabel: PropTypes.string,
    onAdd: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    info: PropTypes.any
  };

  static defaultProps = {};
  render() {
    const { classes, className, onAdd, label, buttonLabel, info } = this.props;
    return (
      <div className={classNames(classes.header, className)}>
        <div className={classes.titleContainer}>
        <Typography variant="title" className={classes.title}>
          {label}
        </Typography>
        {info}
        </div>
        <AddButton onClick={onAdd} label={buttonLabel} />
      </div>
    );
  }
}
const styles = theme => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 2 * theme.spacing.unit
  },
  titleContainer: {
    display: 'flex',
  }
});
export default withStyles(styles)(Header);
