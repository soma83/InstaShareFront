import React, {useContext, useEffect, useRef, useState} from 'react';
import MenuList from '@material-ui/core/MenuList';
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Slide from '@material-ui/core/Slide';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {Link} from 'react-router-dom';
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import PeopleIcon from '@material-ui/icons/People';
import {makeStyles} from "@material-ui/core";
import styles from "../styling";
import clx from "classnames";
import MainContext from "./MainContext";
import NewUserProfile from "../user/NewUserProfile";

const useStyles = makeStyles(() => styles());

function MainHeader() {
  const classes = useStyles();
  const [openProfile, setOpenProfile] = useState(null);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const {logOut, mainData, setLocalMsg, setLoading} = useContext(MainContext);

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleProfile = () => {
    setOpenProfile({id: mainData.user.id});
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const handleLogount = () => {
    logOut();
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="h3">
              InstaShare
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <div className={clx(classes.textAlignRight, classes.movingRight)}>
              <IconButton
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
              >
                <MenuIcon className={classes.colorWhite}/>
              </IconButton>
              <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                <Slide direction="left" in={open} mountOnEnter unmountOnExit>
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                        <Link to="/" className={classes.links}>
                          <ListItem button>
                            <ListItemIcon>
                              <HomeIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Home"/>
                          </ListItem>
                        </Link>
                        <Divider/>
                        <MenuItem onClick={handleProfile} style={{height: '45px'}}>
                          <ListItemIcon>
                            <PersonIcon/>
                          </ListItemIcon>
                          {'My profile'}
                        </MenuItem>
                        <Link to="/files" className={classes.links}>
                          <ListItem button>
                            <ListItemIcon>
                              <InsertDriveFileIcon/>
                            </ListItemIcon>
                            <ListItemText primary="File Handler"/>
                          </ListItem>
                        </Link>
                        {mainData.user.isadmin &&
                        <>
                          <Divider/>
                          <Link to="/users" className={classes.links}>
                            <ListItem button>
                              <ListItemIcon>
                                <PeopleIcon/>
                              </ListItemIcon>
                              <ListItemText primary="Users handler"/>
                            </ListItem>
                          </Link>
                        </>
                        }
                        <Divider/>
                        <MenuItem onClick={handleLogount} style={{height: '45px'}}>
                          <ListItemIcon>
                            <ExitToAppIcon/>
                          </ListItemIcon>
                          {'Logout'}
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Slide>
              </Popper>
            </div>
          </Grid>
        </Grid>
      </Toolbar>
      {openProfile && (
        <NewUserProfile
          setLocalMsg={setLocalMsg}
          setLoading={setLoading}
          handleClose={() => {
            setOpenProfile(null);
          }}
          profiling={openProfile}
        />
      )}
    </AppBar>
  );
}

export default MainHeader;
