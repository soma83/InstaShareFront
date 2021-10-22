import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import styles from "../styling";
import MainHeader from "./MainHeader";

const useStyles = makeStyles(theme => styles(theme));

function Wrapper({children}) {
  const classes = useStyles();

  return (
    <>
      <div className={classes.root}>
        <CssBaseline/>
        <MainHeader/>
        <main className={classes.content}>
          <Toolbar/>
          {children}
        </main>
      </div>
      <footer className={classes.footer}>
        <hr />
        {'InstaShare by Soma83. Delivered on October 21th, 2021.'}
      </footer>
    </>
  );
}

Wrapper.propTypes = {
  children: PropTypes.node.isRequired
};

export default Wrapper;
