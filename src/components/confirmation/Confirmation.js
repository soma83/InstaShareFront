import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

export default function Confirmation({handleClose, handleOk, message}) {
  return (
    <Dialog
      aria-labelledby="confirmation-dialog-title"
      open
    >
      <DialogTitle id="confirmation-dialog-title">Confirm</DialogTitle>
      <DialogContent dividers>
        {message}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

Confirmation.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleOk: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired
};
