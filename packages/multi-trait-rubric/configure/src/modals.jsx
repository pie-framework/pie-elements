import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

export const excludeZeroTypes = {
  remove0: 'remove0',
  add0: 'add0',
  shiftLeft: 'shiftLeft',
  shiftRight: 'shiftRight'
};

export const ExcludeZeroDialog = ({ open, changeExcludeZero, cancel }) => (
  <Dialog open={open}>
    <DialogTitle>
      Exclude 0 (Zero) from Score Point Values.
    </DialogTitle>

    <DialogContent>
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
      <Button onClick={() => changeExcludeZero(excludeZeroTypes.shiftLeft)}>
        Shift to Left
      </Button>

      <Button onClick={() => changeExcludeZero(excludeZeroTypes.remove0)}>
        Remove 0 column
      </Button>

      <Button onClick={cancel}>
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
);

ExcludeZeroDialog.propTypes = {
  open: PropTypes.bool,
  changeExcludeZero: PropTypes.func,
  cancel: PropTypes.func,
};

export const IncludeZeroDialog = ({ open, changeExcludeZero, cancel }) => (
  <Dialog open={open}>
    <DialogTitle>
      Include 0 (Zero) in Score Point Values.
    </DialogTitle>

    <DialogContent>
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
      <Button onClick={() => changeExcludeZero(excludeZeroTypes.shiftRight)}>
        Shift to Right
      </Button>

      <Button onClick={() => changeExcludeZero(excludeZeroTypes.add0)}>
        Add 0 column
      </Button>

      <Button onClick={cancel}>
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
);

IncludeZeroDialog.propTypes = {
  open: PropTypes.bool,
  changeExcludeZero: PropTypes.func,
  cancel: PropTypes.func,
};

export const DecreaseMaxPoints = ({ open, deleteScorePoints, cancel }) => (
  <Dialog open={open}>
    <DialogTitle>
      Decreasing Max Points.
    </DialogTitle>

    <DialogContent>
      <DialogContentText>
        You are about to decrease max score point value.
        <br/>
        All the Labels and Descriptions for scores above Max Point will be deleted.
      </DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button onClick={deleteScorePoints}>
        Ok, delete.
      </Button>

      <Button onClick={cancel}>
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
);

DecreaseMaxPoints.propTypes = {
  open: PropTypes.bool,
  deleteScorePoints: PropTypes.func,
  cancel: PropTypes.func,
};

export const DeleteScale = ({ open, scaleIndex, deleteScale, cancel }) => (
  <Dialog open={open}>
    <DialogTitle>
      Delete Scale #{scaleIndex}
    </DialogTitle>

    <DialogContent>
      <DialogContentText>
        Are you sure you want to delete this scale?
      </DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button onClick={deleteScale}>
        Delete
      </Button>

      <Button onClick={cancel}>
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
);

DeleteScale.propTypes = {
  open: PropTypes.bool,
  scaleIndex: PropTypes.number,
  deleteScale: PropTypes.func,
  cancel: PropTypes.func,
};

export const DeleteTrait = ({ open, deleteTrait, cancel }) => (
  <Dialog open={open}>
    <DialogTitle>
      Delete Trait
    </DialogTitle>

    <DialogContent>
      <DialogContentText>
        Are you sure you want to delete this trait?
      </DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button onClick={deleteTrait}>
        Delete
      </Button>

      <Button onClick={cancel}>
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
);

DeleteTrait.propTypes = {
  open: PropTypes.bool,
  deleteTrait: PropTypes.func,
  cancel: PropTypes.func,
};
