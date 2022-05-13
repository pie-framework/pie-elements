import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import HelpIcon from '@material-ui/icons/HelpOutline';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

const CardBar = props => {
  const { classes, header, children, mini, info } = props;
  return (
    <div className={classes.cardBar}>
      <div className={classes.flexContainer}>
        <Typography variant={mini ? 'subheading' : 'h5'}>{header}</Typography>
        {info}
      </div>
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
  mini: PropTypes.bool,
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
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center'
  }
});
export default withStyles(styles)(CardBar);
