import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from "@material-ui/core/Grid";
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {accessData} from "../../util/request";
import {URL_REQUEST, URL_RESPOND, URL_UPDT_PASSW} from "../../config/config";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Forgot({handleClose, setLoading, setLocalMsg}) {
  const [passw, setPassw] = useState('');
  const [show, setShow] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [confirm, setConfirm] = useState('');
  const [username, setUsername] = useState('');
  const [response, setResponse] = useState({});
  const [answer, setAnswer] = useState(null);

  const updatePassw = () => {
    setLoading(true);
    const responseCall = resp => {
      if (resp.response) {
        setLocalMsg({message: 'New password setted!', type: 'success'});
        handleClose();
      } else {
        setLocalMsg({message: 'Error unable to set the new password!', type: 'error'});
      }
      setLoading(false);
    };
    accessData(URL_UPDT_PASSW, responseCall, {}, 'PUT', {username, passw: btoa(passw)});
  };

  const respond = () => {
    setLoading(true);
    const responseCall = resp => {
      if (resp.response) {
        setResponse({...response, respond: true});
      } else {
        setResponse({...response, respondWrong: 'Wrong answer'})
      }
      setLoading(false);
    };
    accessData(URL_RESPOND, responseCall, {}, 'PUT', {username, response: btoa(answer)});
  };

  const lookForQuestion = () => {
    setLoading(true);
    const responseCall = resp => {
      if (resp.response) {
        setResponse({...response, question: resp.response.secret});
      } else {
        setResponse({...response, username: 'User name not found'})
      }
      setLoading(false);
    };
    accessData(URL_REQUEST, responseCall, {}, 'PUT', {username});
  };

  useEffect(() => {
    if (show && confirm.length) {
      setConfirm('');
    }
  }, [show]);

  useEffect(() => {
    if (username) {
      if (response.username) {
        setResponse({...response, username: undefined});
      }
      if (answer) {
        setAnswer(null);
      }
      if (response.question) {
        setResponse({...response, question: undefined});
      }
      if (response.respond) {
        setResponse({...response, respond: undefined});
      }
    }
  }, [username]);

  useEffect(() => {
    if (answer) {
      if (response.respondWrong) {
        setResponse({...response, respondWrong: undefined});
      }
      if (response.respond) {
        setResponse({...response, respond: undefined});
      }
    }
  }, [answer]);

  const mismatch = !show && passw && passw.length && passw !== confirm;
  const complete = !isEmpty(passw) && ((!show && passw === confirm) || show);

  return (
    <Dialog
      open={true}
      disableBackdropClick
      disableEscapeKeyDown
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">{'Reset password'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <TextField
            value={username || ''}
            label="Username"
            onChange={e => {
              setUsername(e.target.value)
            }}
            fullWidth
            variant="outlined"
            placeholder="Enter your username"
            type="text"
            margin="dense"
            error={response.username}
            helperText={response.username}
            style={{minWidth: '500px'}}
            InputProps={{
              endAdornment: (
                <Button color="primary" onClick={lookForQuestion} disabled={username && username.trim() === ''}>Search</Button>
              )
            }}
          />
          {response.question && <>
            <Typography>{response.question}</Typography>
            <TextField
              value={answer || ''}
              label="Answer"
              onChange={e => {
                setAnswer(e.target.value)
              }}
              fullWidth
              variant="outlined"
              placeholder="Enter your answer for the secret question"
              type={showSecret ? 'text' : 'password'}
              margin="dense"
              error={response.respondWrong}
              helperText={response.respondWrong}
              InputProps={{
                endAdornment: (
                  <>
                    <Tooltip title={(showSecret ? 'Hide' : 'Show') + ' secret'}>
                      <IconButton onClick={() => {
                        setShowSecret(!showSecret);
                      }} size="small">
                        {showSecret ? <VisibilityOffIcon fontSize="small"/> : <VisibilityIcon fontSize="small"/>}
                      </IconButton>
                    </Tooltip>
                    <Button style={{marginLeft: '10px'}} color="primary" onClick={respond} disabled={answer && answer.trim() === ''}>Respond</Button>
                  </>
                )
              }}
            />
          </>}
          {response.respond && (
            <>
              <Typography>Set your new password</Typography>
              <Grid container spacing={1}>
                <Grid item xs={!show ? 7 : 12}>
                  <TextField
                    value={passw || ''}
                    label="Password"
                    onChange={e => { setPassw(e.target.value); }}
                    fullWidth
                    variant="outlined"
                    placeholder="Your password"
                    type={show ? 'text' : 'password'}
                    margin="dense"
                    error={mismatch}
                    helperText={mismatch ? 'Password and confirmation do not match!' : ''}
                    InputProps={{
                      endAdornment: (
                        <Tooltip title={(show ? 'Hide' : 'Show') + ' password'}>
                          <IconButton onClick={() => {
                            setShow(!show);
                          }} size="small">
                            {show ? <VisibilityOffIcon fontSize="small"/> : <VisibilityIcon fontSize="small"/>}
                          </IconButton>
                        </Tooltip>
                      )
                    }}
                  />
                </Grid>
                {!show && <Grid item xs={5}>
                  <TextField
                    value={confirm}
                    label="Password confirm"
                    onChange={e => {
                      setConfirm(e.target.value);
                    }}
                    fullWidth
                    variant="outlined"
                    placeholder="Password confirmation here"
                    type="password"
                    margin="dense"
                  />
                </Grid>}
              </Grid>
            </>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={updatePassw} color="primary" disabled={!complete}>
          Ok
        </Button>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

Forgot.propTypes = {
  handleClose: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  setLocalMsg: PropTypes.func.isRequired
};
