import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import {makeStyles} from "@material-ui/core/styles";
import styles from "./styles-js";

const useStyles = makeStyles(() => styles);

function Loading() {
  const classes = useStyles();
  return (
    <CircularProgress
      className={classes.circularProgress}
      size={70}
      thickness={2}
      color="primary"
    />
  );
}

export default Loading;
