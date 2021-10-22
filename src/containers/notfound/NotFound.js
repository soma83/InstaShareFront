import React from 'react';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  top: {marginTop: '45px'}
}));

function NotFound() {
  const classes = useStyles();
  return (
    <div style={{height: '300px', textAlign: 'center'}}>
      <SentimentVeryDissatisfiedIcon fontSize="large" className={classes.top}/>
      <Typography className={classes.top}>{'Sorry, the requested URL was not found.'}</Typography>
      <Button variant="contained" color="primary" component={Link} to="/" className={classes.top}>
        {'Go back to Welcome'}
      </Button>
    </div>
  );
}

export default NotFound;
