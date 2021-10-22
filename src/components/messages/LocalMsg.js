import React from 'react';
import PropTypes from 'prop-types';
import Portal from '@material-ui/core/Portal';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const LocalMsg = ({message, handleClose, type}) => (
  <Portal>
    <Snackbar open={true} autoHideDuration={3000} onClose={handleClose}>
      <Alert severity={type}>{message}</Alert>
    </Snackbar>
  </Portal>
);

LocalMsg.defaultProps = {
  isError: true,
  type: 'success'
};

LocalMsg.propTypes = {
  message: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  type: PropTypes.string
};

export default LocalMsg;
