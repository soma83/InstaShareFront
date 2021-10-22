import React from 'react'
import PropTypes from 'prop-types';
import {makeStyles} from "@material-ui/core/styles"
import Backdrop from '@material-ui/core/Backdrop';
import styles from "./styles-js";
import Loading from "./Loading";

const useStyles = makeStyles(() => styles);

const Working = ({ open }) => {
  const classes = useStyles();
  return (
    <Backdrop className={classes.backdrop} open={open} timeout={0} transitionDuration={50} style={{ zIndex: 1400 }}>
      <Loading />
    </Backdrop>
  );
};

Working.propTypes = {
  open: PropTypes.bool.isRequired
};

export default Working;
