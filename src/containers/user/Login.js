import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import clx from 'classnames';
import NewUserProfile from "./NewUserProfile";
import {accessData} from "../../util/request";
import {URL_LOGIN} from "../../config/config";
import styles from "../styling";
import Forgot from "./Forgot";

const useStyles = makeStyles({
  root: {
    width: 275,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  },
  title: {fontWeight: 'bold'},
  pos: {marginBottom: 12}
});

const useMainStyles = makeStyles(() => styles());

export default function Login({setLogin, setLocalMsg, setLoading}) {
  const classes = useStyles();
  const mainClasses = useMainStyles();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  const [invalid, setInvalid] = useState(false);

  const [newUser, setNewUser] = useState(false);
  const [forgot, setForgot] = useState(false);

  const checkLogin = () => {
    const response = resp => {
      if (resp.response) {
        setLogin(resp.response);
      } else {
        setLocalMsg({message: 'Error trying to log in!', type: 'error'});
        if (resp.error.exists !== undefined) {
          setInvalid(true);
        }
      }
    };

    const body = {
      username: userName,
      passw: btoa(password)
    };
    accessData(URL_LOGIN, response, {}, 'PUT', body);
  };

  useEffect(() => {
    if (invalid) {
      setInvalid(false);
    }
  }, [userName, password])

  return (
    <>
      <Card className={classes.root} elevation={3}>
        <CardContent>
          {invalid && (
            <div
              className={classes.centering}
              style={{
                background: red[100],
                border: `solid 1px ${red[500]}`,
                borderRadius: '4px'
              }}>
              <Typography style={{color: red[500]}}>{'Invalid credentials!'}</Typography>
            </div>
          )}
          <Typography className={classes.title}>Enter your credentials</Typography>
          <TextField
            value={userName}
            label="Username"
            onChange={e => {
              setUserName(e.target.value);
            }}
            fullWidth
            variant="outlined"
            placeholder="Your username"
            type="text"
            margin="dense"
          />
          <TextField
            value={password}
            label="Password"
            onChange={e => {
              setPassword(e.target.value);
            }}
            fullWidth
            variant="outlined"
            placeholder="Your password"
            type={show ? 'text' : 'password'}
            margin="dense"
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
          <div className={clx(mainClasses.centering, mainClasses.display)} style={{marginTop: '20px'}}>
            <Typography onClick={() => {
              setForgot(true);
            }} style={{cursor: 'pointer', color: blue[500], marginRight: '10px'}}>
              {'Forgot password?'}
            </Typography>
            <Typography>
              {' | '}
            </Typography>
            <Typography onClick={() => {
              setNewUser(true);
            }} style={{cursor: 'pointer', color: blue[500], marginLeft: '10px'}}>
              {'New user?'}
            </Typography>
          </div>
        </CardContent>
        <CardActions>
          <div className={mainClasses.centering}>
            <Button
              color="primary"
              onClick={checkLogin}
              disabled={password.trim() === '' || userName.trim() === '' || invalid}>Ok</Button>
          </div>
        </CardActions>
      </Card>
      {newUser && <NewUserProfile
        setLoading={setLoading}
        setLocalMsg={setLocalMsg}
        handleClose={() => {
          setNewUser(false);
        }}
      />}
      {forgot && <Forgot
        setLoading={setLoading}
        setLocalMsg={setLocalMsg}
        handleClose={() => {
          setForgot(false);
        }}
      />}
    </>
  );
}

Login.propTypes = {
  setLogin: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  setLocalMsg: PropTypes.func.isRequired
};
