import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

export const RemoveAddButton = ({ className, label, type = 'add', onClick }) => {
  const Tag = type === 'add' ? AddCircleIcon : RemoveCircleIcon;
  return (
    <Button color="primary" size="small" className={className} onClick={onClick}>
      <Tag fontSize="small" color="primary" style={{ marginRight: 4 }} />
      {label}
    </Button>
  );
};

export const PassageButton = styled(RemoveAddButton)(({ theme }) => ({
  textDecoration: 'underline',
  '&:hover': {
    textDecoration: 'underline',
    backgroundColor: 'transparent',
  },
  display: 'flex',
  alignItems: 'center',
}));

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
