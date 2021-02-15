import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import { color } from '@pie-lib/render-ui';

export const excludeZeroTypes = {
  remove0: 'remove0',
  add0: 'add0',
  shiftLeft: 'shiftLeft',
  shiftRight: 'shiftRight'
};

const styles = () => ({
  root: {
    padding: '20px',
  },
  title: {
    padding: '0 0 18px 0',

    '& h2': {
      fontSize: '20px',
      lineHeight: '23px',
      fontFamily: 'Cerebri Sans',
      color: color.text()
    }
  },
  text: {
    paddingLeft: '0',

    '& p': {
      fontSize: '16px',
      fontFamily: 'Cerebri Sans',
      color: color.text()
    }
  },
  button: {
    padding: '11px 16px',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'Cerebri Sans',
    lineHeight: '14px',
    textTransform: 'none',
    background: color.primary(),
    color: 'white'
  },
  cancelButton: {
    background: color.secondaryBackground(),
    color: color.text()
  },
});

const RawExcludeZeroDialog = ({open, changeExcludeZero, cancel, classes}) => (
  <Dialog open={open} classes={{paper: classes.root}}>
    <DialogTitle classes={{root: classes.title}}>
      Exclude 0 (Zero) from Score Point Values.
    </DialogTitle>

    <DialogContent classes={{root: classes.text}}>
      <DialogContentText>
        You are about to exclude 0 from score point values.
        <br/>
        Some of the existing data has to be changed.
        <br/>
        Please choose if you want to:
        <ul>
          <li>
            shift Labels and Descriptions to the left
          </li>
          <li>
            remove 0 column with its Label and Description
          </li>
        </ul>
      </DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button classes={{root: `${classes.button} ${classes.cancelButton}`}} onClick={cancel}>
        Cancel
      </Button>

      <Button classes={{root: classes.button}} onClick={() => changeExcludeZero(excludeZeroTypes.shiftLeft)}>
        Shift to Left
      </Button>

      <Button classes={{root: classes.button}} onClick={() => changeExcludeZero(excludeZeroTypes.remove0)}>
        Remove 0 column
      </Button>

    </DialogActions>
  </Dialog>
);

RawExcludeZeroDialog.propTypes = {
  classes: PropTypes.object,
  open: PropTypes.bool,
  changeExcludeZero: PropTypes.func,
  cancel: PropTypes.func,
};

const ExcludeZeroDialog = withStyles(styles)(RawExcludeZeroDialog);

const RawIncludeZeroDialog = ({open, changeExcludeZero, cancel, classes}) => (
  <Dialog open={open} classes={{paper: classes.root}}>
    <DialogTitle classes={{root: classes.title}}>
      Include 0 (Zero) in Score Point Values.
    </DialogTitle>

    <DialogContent classes={{root: classes.text}}>
      <DialogContentText>
        You are about to include 0 in score point values.
        <br/>
        Some of the existing data has to be changed.
        <br/>
        Please choose if you want to:
        <ul>
          <li>
            shift Labels and Descriptions to the right
          </li>
          <li>
            add 0 column with empty Label and Descriptions
          </li>
        </ul>
      </DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button classes={{root: `${classes.button} ${classes.cancelButton}`}} onClick={cancel}>
        Cancel
      </Button>

      <Button classes={{root: classes.button}} onClick={() => changeExcludeZero(excludeZeroTypes.shiftRight)}>
        Shift to Right
      </Button>

      <Button classes={{root: classes.button}} onClick={() => changeExcludeZero(excludeZeroTypes.add0)}>
        Add 0 column
      </Button>

    </DialogActions>
  </Dialog>
);

RawIncludeZeroDialog.propTypes = {
  classes: PropTypes.object,
  open: PropTypes.bool,
  changeExcludeZero: PropTypes.func,
  cancel: PropTypes.func,
};

const IncludeZeroDialog = withStyles(styles)(RawIncludeZeroDialog);

const RawDecreaseMaxPoints = ({open, deleteScorePoints, cancel, classes}) => (
  <Dialog open={open} classes={{paper: classes.root}}>
    <DialogTitle classes={{root: classes.title}}>
      Decreasing Max Points.
    </DialogTitle>

    <DialogContent classes={{root: classes.text}}>
      <DialogContentText>
        You are about to decrease max score point value.
        <br/>
        All the Labels and Descriptions for scores above Max Point will be deleted.
      </DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button classes={{root: `${classes.button} ${classes.cancelButton}`}} onClick={cancel}>
        Cancel
      </Button>

      <Button classes={{root: classes.button}} onClick={deleteScorePoints}>
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);

RawDecreaseMaxPoints.propTypes = {
  classes: PropTypes.object,
  open: PropTypes.bool,
  deleteScorePoints: PropTypes.func,
  cancel: PropTypes.func,
};

const DecreaseMaxPoints = withStyles(styles)(RawDecreaseMaxPoints);

const RawDeleteScale = ({open, scaleIndex, deleteScale, cancel, classes}) => (
  <Dialog open={open} classes={{paper: classes.root}}>
    <DialogTitle classes={{root: classes.title}}>
      Delete Scale #{scaleIndex}
    </DialogTitle>

    <DialogContent classes={{root: classes.text}}>
      <DialogContentText>
        Are you sure you want to delete this scale?
      </DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button classes={{root: `${classes.button} ${classes.cancelButton}`}} onClick={cancel}>
        Cancel
      </Button>

      <Button classes={{root: classes.button}} onClick={deleteScale}>
        Delete
      </Button>

    </DialogActions>
  </Dialog>
);

RawDeleteScale.propTypes = {
  classes: PropTypes.object,
  open: PropTypes.bool,
  scaleIndex: PropTypes.number,
  deleteScale: PropTypes.func,
  cancel: PropTypes.func,
};

const DeleteScale = withStyles(styles)(RawDeleteScale);

const RawDeleteTrait = ({open, deleteTrait, cancel, classes}) => (
  <Dialog open={open} classes={{paper: classes.root}}>
    <DialogTitle classes={{root: classes.title}}>
      Delete Trait
    </DialogTitle>

    <DialogContent classes={{root: classes.text}}>
      <DialogContentText>
        Are you sure you want to delete this trait?
      </DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button classes={{root: `${classes.button} ${classes.cancelButton}`}} onClick={cancel}>
        Cancel
      </Button>

      <Button classes={{root: classes.button}} onClick={deleteTrait}>
        Delete
      </Button>

    </DialogActions>
  </Dialog>
);

RawDeleteTrait.propTypes = {
  classes: PropTypes.object,
  open: PropTypes.bool,
  deleteTrait: PropTypes.func,
  cancel: PropTypes.func,
};

const DeleteTrait = withStyles(styles)(RawDeleteTrait);


export {ExcludeZeroDialog, IncludeZeroDialog, DecreaseMaxPoints, DeleteScale, DeleteTrait}
