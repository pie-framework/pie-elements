import * as React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

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
