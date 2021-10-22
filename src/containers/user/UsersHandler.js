import React, {useContext, useEffect, useState} from 'react';
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import {accessData} from "../../util/request";
import {URL_UPDT_STATUS, URL_USERS} from "../../config/config";
import MainContext from "../common/MainContext";
import {makeStyles} from "@material-ui/core/styles";
import styles from "../styling";
import Button from "@material-ui/core/Button";
import NewUserProfile from "./NewUserProfile";
import clx from 'classnames';
import Confirmation from "../../components/confirmation/Confirmation";

const useStyles = makeStyles(() => styles());

function UsersHandler() {
  const classes = useStyles();
  const [newUser, setNewUser] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const [users, setUsers] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const {setLocalMsg, setLoading, mainData} = useContext(MainContext);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const openContext = user => event => {
    event.preventDefault();
    setContextMenu({x: event.clientX - 2, y: event.clientY - 4, user});
  };

  const loadUsers = () => {
    setLoading(true);
    const response = resp => {
      if (resp.response) {
        setUsers(resp.response);
      } else {
        setLocalMsg({message: 'Error loading users!', type: 'error'});
      }
      setLoading(false);
    };
    accessData(URL_USERS, response);
  };

  const deleteUser = ({id}) => {
    setLoading(true);
    const response = resp => {
      if (resp.response) {
        setLocalMsg({message: 'User deleted!', type: 'success'});
        loadUsers();
      } else {
        setLocalMsg({message: 'Error deleting user!', type: 'error'});
      }
      setContextMenu(null);
      setLoading(false);
    };
    accessData(URL_USERS + '/' + id, response, {}, 'DELETE');
  };

  const updateStatus = username => {
    setLoading(true);
    const response = resp => {
      if (resp.response) {
        setLocalMsg({message: 'Status changed!', type: 'success'});
        loadUsers();
      } else {
        setLocalMsg({message: 'Unable to update status!', type: 'error'});
      }
      setContextMenu(null);
      setLoading(false);
    };
    accessData(URL_UPDT_STATUS, response, {}, 'PUT', {username});
  };

  const drawContextMenu = () => {
    const {x, y, user} = contextMenu;
    const admins = users.filter(u => u.isadmin).length;
    const disable = user.isadmin && admins === 1;

    return (
      <Menu
        keepMounted
        open={contextMenu !== null}
        onClose={() => {
          setContextMenu(null);
        }}
        anchorReference="anchorPosition"
        anchorPosition={contextMenu !== null ? {top: y, left: x} : undefined}
      >
        <MenuItem onClick={() => {
          updateStatus(user.username)
        }} disabled={disable}>
          <Typography>
            {!user.isadmin ? 'Turn user into admin' : 'Remove admin capabilities'}
          </Typography>
        </MenuItem>
        {mainData.user.username !== user.username && (
          <>
            <Divider/>
            <MenuItem onClick={() => {
              setConfirmation({msg: `You are going to delete the user "${user.username}". Sure?`, id: user.id});
              setContextMenu(null);
            }} disabled={disable}>
              <Typography>
                {'Delete user'}
              </Typography>
            </MenuItem>
          </>
        )}
      </Menu>
    );
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (<>
    <Paper className={classes.paperRoot} elevation={4} style={{padding: '16px'}}>
      {!users ? <Typography>{'Loading...'}</Typography> :
        <>
          <Button onClick={() => {
            setNewUser(true);
          }} color="primary">
            New user
          </Button>
          <Paper className={classes.paperRoot} elevation={4}>
            <TableContainer className={clx(classes.container, classes.bordering)}>
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell key="name">
                      {'Name'}
                    </TableCell>
                    <TableCell key="surname">
                      {'Surname'}
                    </TableCell>
                    <TableCell key="username">
                      {'Username'}
                    </TableCell>
                    <TableCell key="email">
                      {'Email'}
                    </TableCell>
                    <TableCell key="isadmin">
                      {'Is admin'}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => {
                    return (
                      <TableRow hover tabIndex={-1} key={user.id} className={classes.handPointer}
                                onContextMenu={openContext(user)}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.surname}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.isadmin ? 'Yes' : 'No'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 15, 25, 50, 100]}
              component="div"
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </>
      }
    </Paper>
    {confirmation && <Confirmation message={confirmation.msg} handleClose={() => {
      setConfirmation(null);
    }} handleOk={() => {
      deleteUser({id: confirmation.id});
      setConfirmation(null);
    }}/>}
    {contextMenu && drawContextMenu()}
    {newUser && <NewUserProfile setLocalMsg={setLocalMsg} setLoading={setLoading} handleClose={() => {
      setNewUser(false);
    }} informParent={loadUsers}/>}
  </>);
}

export default UsersHandler;
