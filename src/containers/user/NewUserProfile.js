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
import {EMAIL} from "../../config/constants";
import {accessData} from "../../util/request";
import {URL_USERS} from "../../config/config";
import {capitalize} from "../../util/utils";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function NewUserProfile({handleClose, setLoading, setLocalMsg, profiling, informParent}) {
  const [data, setData] = useState({});
  const [show, setShow] = useState(false);
  const [showResp, setShowResp] = useState(false);
  const [confirm, setConfirm] = useState('');
  const [firstUser, setFirstUser] = useState(false);
  const [errors, setErrors] = useState({});

  const isNew = informParent !== null;

  const settingData = prop => e => {
    setData({...data, [prop]: e.target.value});
  };

  const checkNewUser = () => {
    setLoading(true);
    const response = resp => {
      if (resp.response && resp.response.first) {
        setFirstUser(true);
      }
      setLoading(false);
    };
    accessData(URL_USERS + '?first=true', response)
  };

  const loadData = () => {
    setLoading(true);
    const response = resp => {
      if (resp.response) {
        setData({
          name: resp.response.name,
          surname: resp.response.surname,
          username: resp.response.username,
          email: resp.response.email,
          secret: resp.response.secret,
          response: atob(resp.response.response)
        });
      } else {
        setLocalMsg({message: 'Unable to load user profile!', type: 'error'});
        handleClose();
      }
      setLoading(false);
    };
    accessData(URL_USERS + '/' + profiling.id, response);
  };

  const handleOk = () => {
    setLoading(true);
    if (!isEmpty(errors)) {
      setErrors({});
    }
    const response = resp => {
      if (resp.response) {
        setLocalMsg({message: `User ${!profiling ? 'created' : 'updated'}!`, type: 'success'});
        if (informParent) {
          informParent();
        }
        handleClose();
      } else {
        setLocalMsg({message: `Error ${!profiling ? 'creating' : 'updating'} user!`, type: 'error'});
        if (resp.error.errors) {
          const error = {};
          Object.keys(resp.error.errors).forEach(e => {
            error[e] = capitalize(resp.error.errors[e][0]);
          });
          setErrors(error);
        }
      }
      setLoading(false);
    };

    const body = {
      name: data.name,
      surname: data.surname,
      username: data.username,
      email: data.email,
      passw: btoa(data.passw),
      secret: data.secret,
      response: btoa(data.response),
      isadmin: firstUser
    };

    let URL = URL_USERS;
    let method = 'POST';

    if (Boolean(profiling)) {
      method = 'PATCH';
      URL += '/' + profiling.id;
    }
    accessData(URL, response, {}, method, body);
  };

  useEffect(() => {
    if (!profiling) {
      checkNewUser();
    } else {
      loadData();
    }
  }, []);

  useEffect(() => {
    if (show && confirm.length) {
      setConfirm('');
    }
  }, [show]);

  const validEmail = !isEmpty(data.email) ? EMAIL.test(data.email) : true;
  const mismatch = !show && data.passw && data.passw.length && data.passw !== confirm;

  const complete = !isEmpty(data.name) && !isEmpty(data.surname) && !isEmpty(data.username) && !isEmpty(data.email) && validEmail
    && !isEmpty(data.secret) && !isEmpty(data.response) && !isEmpty(data.passw) && ((!show && data.passw === confirm) || show);

  const tooltip = `Just in case ${isNew ? 'of forgetting the' : 'you forget your'} password`

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
      <DialogTitle id="alert-dialog-slide-title">{!profiling ? 'New user' : 'My profile'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {firstUser && <Typography color="primary">{'First user! Yay you are going to be admin!'}</Typography>}
          <TextField
            value={data.name || ''}
            label="Name"
            onChange={settingData('name')}
            fullWidth
            variant="outlined"
            placeholder={isNew ? 'New user name' : 'Your name'}
            type="text"
            margin="dense"
          />
          <TextField
            value={data.surname || ''}
            label="Surname"
            onChange={settingData('surname')}
            fullWidth
            variant="outlined"
            placeholder={isNew ? 'New user surname' : 'Your surname'}
            type="text"
            margin="dense"
          />
          <TextField
            value={data.username || ''}
            label="Username"
            onChange={settingData('username')}
            fullWidth
            variant="outlined"
            placeholder={isNew ? 'New username' : 'Your username'}
            type="text"
            disabled={Boolean(profiling)}
            margin="dense"
            error={errors.username}
            helperText={errors.username}
          />
          <TextField
            value={data.email || ''}
            label="Email"
            onChange={settingData('email')}
            fullWidth
            variant="outlined"
            placeholder={isNew ? 'New user email' : 'Your email'}
            type="text"
            margin="dense"
            helperText={errors.email || (validEmail ? '' : 'Email is invalid')}
            error={errors.email || !validEmail}
          />
          <Tooltip title={tooltip}>
            <TextField
              value={data.secret || ''}
              label="Secret question"
              onChange={settingData('secret')}
              fullWidth
              variant="outlined"
              placeholder={isNew ? 'New user secret question' : 'Your secret question'}
              type="text"
              margin="dense"
            />
          </Tooltip>
          <Tooltip title={tooltip}>
            <TextField
              value={data.response || ''}
              label="Secret response"
              onChange={settingData('response')}
              fullWidth
              variant="outlined"
              placeholder={isNew ? 'New user response' : 'Your secret response'}
              type={showResp ? 'text' : 'password'}
              margin="dense"
              InputProps={{
                endAdornment: (
                  <Tooltip title={(showResp ? 'Hide' : 'Show') + ' response'}>
                    <IconButton onClick={() => {
                      setShowResp(!showResp);
                    }} size="small">
                      {showResp ? <VisibilityOffIcon fontSize="small"/> : <VisibilityIcon fontSize="small"/>}
                    </IconButton>
                  </Tooltip>
                )
              }}
            />
          </Tooltip>
          <Grid container spacing={1}>
            <Grid item xs={!show ? 7 : 12}>
              <TextField
                value={data.passw || ''}
                label="Password"
                onChange={settingData('passw')}
                fullWidth
                variant="outlined"
                placeholder="Password here"
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
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOk} color="primary" disabled={!complete}>
          Ok
        </Button>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

NewUserProfile.defaultProps = {
  profiling: null,
  informParent: null
};

NewUserProfile.propTypes = {
  handleClose: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  setLocalMsg: PropTypes.func.isRequired,
  profiling: PropTypes.shape({id: PropTypes.string}),
  informParent: PropTypes.func
};
