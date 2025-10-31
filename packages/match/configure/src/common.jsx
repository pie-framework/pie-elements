import * as React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

export const InfoDialog = ({ title, open, onOk }) => (
  <Dialog open={open}>
    <DialogTitle>{title}</DialogTitle>
    <DialogActions>
      {onOk && (
        <Button onClick={onOk} color="primary">
          OK
        </Button>
      )}
    </DialogActions>
  </Dialog>
);

InfoDialog.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  onOk: PropTypes.func,
};
