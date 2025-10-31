import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import { Button } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

export const RemoveAddButton = ({ classes, label, type = 'add', onClick }) => {
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
  content: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  cancel: PropTypes.string.isRequired,
  ok: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
};
