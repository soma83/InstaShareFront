import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function RenameFile({previousName, setRename, handleClose}) {
  const [newName, setNewName] = useState(previousName);
  return (
    <Dialog open={Boolean(previousName)} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Rename</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Renaming file:
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="New name"
          type="email"
          fullWidth
          value={newName}
          onChange={e => {
            setNewName(e.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={() => {setRename(newName);}} color="primary" disabled={newName === previousName}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

RenameFile.propTypes = {
  previousName: PropTypes.string.isRequired,
  setRename: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired
};
