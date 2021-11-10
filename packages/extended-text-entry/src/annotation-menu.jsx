import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Popover } from '@material-ui/core';

const styles = {
  mainWrapper: {
    width: '300px',
    overflow: 'hidden',
    borderRadius: '4px',
    backgroundColor: '#ffffff',
    border: '2px solid #d3d3d3'
  },
  annotationsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  controlsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    borderTop: '2px solid #d3d3d3'
  },
  button: {
    width: '22%',
    textAlign: 'center',
    padding: '4px',
    cursor: 'pointer',
    borderBottom: '1px solid #d3d3d3',
    '&:not(:nth-child(4n))': {
      borderRight: '1px solid #d3d3d3',
    },
    '&:nth-child(4n)': {
      flexGrow: 1
    },
    '&:hover': {
      backgroundColor: '#d3d3d3'
    },
  },
  positive: {
    backgroundColor: 'rgb(153, 255, 153) !important',
    '&:hover': {
      filter: 'brightness(85%)'
    }
  },
  negative: {
    backgroundColor: 'rgb(255, 204, 238) !important',
    '&:hover': {
      filter: 'brightness(85%)'
    }
  },
  holder: {
    display: 'flex',
    flexWrap: 'wrap',
    borderTop: '2px solid #d3d3d3'
  },
  arrow: {
    overflowX: 'unset',
    overflowY: 'unset',
    marginTop: '-16px',
    '&::after': {
      position: 'absolute',
      left: 'calc(50% - 7px)',
      // bottom: 0,
      border: 'solid transparent',
      content: '""',
      height: 0,
      width: 0,
      pointerEvents: 'none',
      borderWidth: '7px',
      borderTopColor: 'black'
    }
  }
};

class AnnotationMenu extends React.Component {
  render() {
    const {
      anchorEl,
      annotations,
      classes,
      isNewAnnotation,
      onAnnotate,
      onClose,
      onEdit,
      onDelete,
      onWrite,
      open
    } = this.props;

    return (
      <Popover
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        classes={{paper: classes.arrow}}
        elevation={5}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <div className={classes.mainWrapper}>
          <div className={classes.annotationsWrapper}>
            {annotations.map((annotation, index) => (
              <div
                key={`annotation-${index}`}
                className={classNames(
                  classes.button,
                  annotation.type === 'positive' ? classes.positive : classes.negative
                )}
                onClick={event => onAnnotate(event, annotation)}
              >{annotation.label}</div>
            ))}
          </div>
          <div className={classes.controlsWrapper}>
            <div className={classes.button} onClick={onClose}>
              Cancel
            </div>
            <div style={{pointerEvents: 'none'}} className={classes.button}/>
            {isNewAnnotation ? (
              <React.Fragment>
                <div className={classes.button} onClick={onDelete}>
                  Delete
                </div>
                <div className={classes.button} onClick={onEdit}>
                  Edit
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div
                  className={classNames(classes.button, classes.positive)}
                  onClick={() => onWrite('positive')}
                >
                  Write
                </div>
                <div
                  className={classNames(classes.button, classes.negative)}
                  onClick={() => onWrite('negative')}
                >
                  Write
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </Popover>
    );
  }
};

export default withStyles(styles)(AnnotationMenu);
