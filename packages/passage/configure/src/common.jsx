import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

function RemoveAddButton({ classes, label, type = 'add', onClick }) {
  const Tag = type === 'add' ? AddCircleIcon : RemoveCircleIcon;
  return (
    <Button color="primary" size="small" className={classes.root} onClick={onClick}>
      <Tag fontSize={'small'} color={'primary'} className={classes.icon} />
      {label}
    </Button>
  );
}

export const PassageButton = withStyles((theme) => ({
  root: {
    textDecoration: 'underline',
    '&:hover': {
      textDecoration: 'underline',
      backgroundColor: 'transparent',
    },
  },
  label: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacing.unit / 2,
  },
}))(RemoveAddButton);

export const ConfimationDialog = ({ content, cancel, title, ok, open, onOk, onCancel }) => (
  <Dialog open={open}>
    <DialogTitle>{title}</DialogTitle>

    <DialogContent>
      <DialogContentText>{content}</DialogContentText>
    </DialogContent>

    <DialogActions>
      {onOk && (
        <Button onClick={onOk} color="primary">
          {ok}
        </Button>
      )}
      {onCancel && (
        <Button onClick={onCancel} color="primary">
          {cancel}
        </Button>
      )}
    </DialogActions>
  </Dialog>
);

ConfimationDialog.propTypes = {
  content: PropTypes.string,
  title: PropTypes.string,
  cancel: PropTypes.string,
  ok: PropTypes.string,
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
};
