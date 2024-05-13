import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Popover } from '@material-ui/core';

const styles = (theme) => ({
  mainWrapper: {
    width: '300px',
    overflow: 'hidden',
    borderRadius: '4px',
    backgroundColor: theme.palette.common.white,
    border: `2px solid ${theme.palette.grey[100]}`,
  },
  annotationsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  controlsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    borderTop: `2px solid ${theme.palette.grey[100]}`,
  },
  button: {
    width: '22%',
    textAlign: 'center',
    padding: '4px',
    cursor: 'pointer',
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    '&:not(:nth-child(4n))': {
      borderRight: `1px solid ${theme.palette.grey[100]}`,
    },
    '&:nth-child(4n)': {
      flexGrow: 1,
    },
    '&:hover': {
      backgroundColor: theme.palette.grey[100],
    },
  },
  positive: {
    backgroundColor: 'rgb(153, 255, 153) !important',
    '&:hover': {
      filter: 'brightness(85%)',
    },
  },
  negative: {
    backgroundColor: 'rgb(255, 204, 238) !important',
    '&:hover': {
      filter: 'brightness(85%)',
    },
  },
  holder: {
    display: 'flex',
    flexWrap: 'wrap',
    borderTop: `2px solid ${theme.palette.grey[100]}`,
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
      borderTopColor: 'black',
    },
  },
});

class AnnotationMenu extends React.Component {
  static propTypes = {
    anchorEl: PropTypes.object,
    open: PropTypes.bool,
    annotations: PropTypes.array,
    isNewAnnotation: PropTypes.bool,
    onClose: PropTypes.func,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
    onWrite: PropTypes.func,
    onAnnotate: PropTypes.func,
  };

  render() {
    const { anchorEl, annotations, classes, isNewAnnotation, onAnnotate, onClose, onEdit, onDelete, onWrite, open } =
      this.props;

    return (
      <Popover
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        classes={{ paper: classes.arrow }}
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
                  annotation.type === 'positive' ? classes.positive : classes.negative,
                )}
                onClick={() => onAnnotate(annotation)}
              >
                {annotation.label}
              </div>
            ))}
          </div>
          <div className={classes.controlsWrapper}>
            <div className={classes.button} onClick={onClose}>
              Cancel
            </div>
            <div style={{ pointerEvents: 'none' }} className={classes.button} />
            {isNewAnnotation ? (
              <React.Fragment>
                <div className={classNames(classes.button, classes.positive)} onClick={() => onWrite('positive')}>
                  Write
                </div>
                <div className={classNames(classes.button, classes.negative)} onClick={() => onWrite('negative')}>
                  Write
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className={classes.button} onClick={onDelete}>
                  Delete
                </div>
                <div className={classes.button} onClick={onEdit}>
                  Edit
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </Popover>
    );
  }
}

export default withStyles(styles)(AnnotationMenu);
