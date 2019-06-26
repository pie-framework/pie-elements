import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import HelpIcon from '@material-ui/icons/HelpOutline';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

const CardBar = props => {
  const { classes, header, children, mini } = props;
  return (
    <div className={classes.cardBar}>
      <Typography variant={mini ? 'subheading' : 'h5'}>{header}</Typography>
      {children && (
        <Tooltip title={children} classes={{ tooltip: classes.tooltip }}>
          <IconButton aria-label="Delete" className={classes.button}>
            <HelpIcon />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};

CardBar.propTypes = {
  classes: PropTypes.object,
  header: PropTypes.string,
  children: PropTypes.node
};
const styles = theme => ({
  cardBar: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2
  },
  button: {
    margin: 0,
    padding: 0
  },
  tooltip: {
    fontSize: '12px'
  }
});
export default withStyles(styles)(CardBar);
