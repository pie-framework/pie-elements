import withStyles from '@mui/styles/withStyles';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/HelpOutline';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

const CardBar = (props) => {
  const { classes, header, children, mini, info } = props;

  return (
    <div className={classes.cardBar}>
      <div className={classes.flexContainer}>
        <Typography variant={mini ? 'subheading' : 'h5'}>{header}</Typography>
        {info}
      </div>
      {children && (
        <Tooltip title={children} classes={{ tooltip: classes.tooltip }}>
          <IconButton aria-label="Delete" className={classes.button} size="large">
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
  children: PropTypes.node,
  info: PropTypes.any,
};

const styles = (theme) => ({
  cardBar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    margin: 0,
    padding: 0,
  },
  tooltip: {
    fontSize: theme.typography.fontSize - 2,
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
  },
});

export default withStyles(styles)(CardBar);
