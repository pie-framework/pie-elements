import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles/index';

const styles = theme => ({
  base: {
    border: '1px solid #E0E1E6',
    borderRadius: '5px'
  },
  header: {
    backgroundColor: '#ECEDF1',
    padding: '12px 8px',
    display: 'flex',
    justifyContent: 'space-between',
    // marginBottom: 2 * theme.spacing.unit,
    borderBottom: '1px solid #E0E1E6',
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
  },
  headerItem: {
    backgroundColor: '#E0E0E0',
    color: '#A9A9A9',
    borderRadius: '4px'
  },
  headerItemUndo: {
    marginRight: '5px'
  },
  imageSection: {
    height: theme.spacing.unit * 20
  }
});

class Hotspot extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.base}>
        <div className={classes.header}>
          <button className={classes.headerItem}>
            Rectangle
          </button>
          <div>
            <button className={classes.headerItem}>
              Undo
            </button>
            <button className={classes.headerItem}>
              Clear All
            </button>
          </div>
        </div>
        <div className={classes.imageSection}>
          Upload image right here
        </div>
      </div>
    )
  }
}

const Styled = withStyles(styles)(Hotspot);

export default Styled;
