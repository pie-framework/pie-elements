import React from 'react';
import PropTypes from 'prop-types';

import withStyles from '@mui/styles/withStyles';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import { color } from '@pie-lib/render-ui';

import defaults from './defaults';

const {
  configuration: {
    excludeZeroDialogBoxContent,
    includeZeroDialogBoxContent,
    deleteScaleDialogBoxContent,
    maxPointsDialogBoxContent,
  },
} = defaults;

export const excludeZeroTypes = {
  remove0: 'remove0',
  add0: 'add0',
  shiftLeft: 'shiftLeft',
  shiftRight: 'shiftRight',
};

const styles = (theme) => ({
  root: {
    padding: theme.spacing.unit * 2.5,
  },
  title: {
    padding: `0 0 ${theme.spacing.unit * 2}px 0`,

    '& h2': {
      fontSize: '20px',
      lineHeight: '23px',
      fontFamily: 'Cerebri Sans',
      color: color.text(),
    },
  },
  text: {
    paddingLeft: '0',

    '& p': {
      fontSize: theme.typography.fontSize + 2,
      fontFamily: 'Cerebri Sans',
      color: color.text(),
    },
  },
  button: {
    padding: `${theme.spacing.unit * 1.5}px ${theme.spacing.unit * 2}px`,
    borderRadius: '4px',
    fontSize: theme.typography.fontSize,
    fontFamily: 'Cerebri Sans',
    lineHeight: '14px',
    textTransform: 'none',
    background: color.primary(),
    color: theme.palette.common.white,
  },
  cancelButton: {
    background: color.secondaryBackground(),
    color: color.text(),
  },
});

const RawExcludeZeroDialog = ({ open, changeExcludeZero, cancel, classes }) => (
  <Dialog open={open} classes={{ paper: classes.root }}>
    <DialogTitle classes={{ root: classes.title }}>{excludeZeroDialogBoxContent.title}</DialogTitle>

    <DialogContent classes={{ root: classes.text }}>
      <DialogContentText>
        <div dangerouslySetInnerHTML={{ __html: excludeZeroDialogBoxContent.text }} />
      </DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button classes={{ root: `${classes.button} ${classes.cancelButton}` }} onClick={() => cancel()}>
        Cancel
      </Button>

      <Button classes={{ root: classes.button }} onClick={() => changeExcludeZero(excludeZeroTypes.shiftLeft)}>
        Shift to Left
      </Button>

      <Button classes={{ root: classes.button }} onClick={() => changeExcludeZero(excludeZeroTypes.remove0)}>
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

const RawIncludeZeroDialog = ({ open, changeExcludeZero, cancel, classes }) => (
  <Dialog open={open} classes={{ paper: classes.root }}>
    <DialogTitle classes={{ root: classes.title }}>{includeZeroDialogBoxContent.title}</DialogTitle>

    <DialogContent classes={{ root: classes.text }}>
      <DialogContentText>
        <div dangerouslySetInnerHTML={{ __html: includeZeroDialogBoxContent.text }} />
      </DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button classes={{ root: `${classes.button} ${classes.cancelButton}` }} onClick={() => cancel()}>
        Cancel
      </Button>

      <Button classes={{ root: classes.button }} onClick={() => changeExcludeZero(excludeZeroTypes.shiftRight)}>
        Shift to Right
      </Button>

      <Button classes={{ root: classes.button }} onClick={() => changeExcludeZero(excludeZeroTypes.add0)}>
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

const RawDecreaseMaxPoints = ({ open, deleteScorePoints, cancel, classes }) => (
  <Dialog open={open} classes={{ paper: classes.root }}>
    <DialogTitle classes={{ root: classes.title }}>{maxPointsDialogBoxContent.title}</DialogTitle>

    <DialogContent classes={{ root: classes.text }}>
      <DialogContentText>
        <div dangerouslySetInnerHTML={{ __html: maxPointsDialogBoxContent.text }} />
      </DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button classes={{ root: `${classes.button} ${classes.cancelButton}` }} onClick={cancel}>
        Cancel
      </Button>

      <Button classes={{ root: classes.button }} onClick={deleteScorePoints}>
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

const RawDeleteScale = ({ open, scaleIndex, deleteScale, cancel, classes }) => (
  <Dialog open={open} classes={{ paper: classes.root }}>
    <DialogTitle classes={{ root: classes.title }}>
      {`${deleteScaleDialogBoxContent.title} #${scaleIndex + 1}`}
    </DialogTitle>

    <DialogContent classes={{ root: classes.text }}>
      <DialogContentText>
        <div dangerouslySetInnerHTML={{ __html: deleteScaleDialogBoxContent.text }} />
      </DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button classes={{ root: `${classes.button} ${classes.cancelButton}` }} onClick={cancel}>
        Cancel
      </Button>

      <Button classes={{ root: classes.button }} onClick={deleteScale}>
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

const RawDeleteTrait = ({ open, deleteTrait, cancel, classes, traitLabel }) => (
  <Dialog open={open} classes={{ paper: classes.root }}>
    <DialogTitle classes={{ root: classes.title }}>Delete {traitLabel}</DialogTitle>

    <DialogContent classes={{ root: classes.text }}>
      <DialogContentText>
        <div dangerouslySetInnerHTML={{ __html: `Are you sure you want to delete this ${traitLabel}?` }} />
      </DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button classes={{ root: `${classes.button} ${classes.cancelButton}` }} onClick={cancel}>
        Cancel
      </Button>

      <Button classes={{ root: classes.button }} onClick={deleteTrait}>
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
  traitLabel: PropTypes.string,
};

const DeleteTrait = withStyles(styles)(RawDeleteTrait);

const RawInfoDialog = ({ classes, open, text, onClose }) => (
  <Dialog open={open} classes={{ paper: classes.root }}>
    <DialogTitle classes={{ root: classes.title }}>{text}</DialogTitle>

    <DialogActions>
      <Button classes={{ root: classes.button }} onClick={onClose}>
        OK
      </Button>
    </DialogActions>
  </Dialog>
);

RawInfoDialog.propTypes = {
  classes: PropTypes.object,
  open: PropTypes.bool,
  text: PropTypes.string,
  cancel: PropTypes.func,
  onClose: PropTypes.func,
};

const InfoDialog = withStyles(styles)(RawInfoDialog);

export { ExcludeZeroDialog, IncludeZeroDialog, DecreaseMaxPoints, DeleteScale, DeleteTrait, InfoDialog };
