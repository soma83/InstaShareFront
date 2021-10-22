import React, {useContext, useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import InputAdornment from '@material-ui/core/InputAdornment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import styles from "../styling";
import clx from "classnames";
import UploadComp from "./UploadComp";
import MainContext from "../common/MainContext";
import {accessData} from "../../util/request";
import {URL_USERS} from "../../config/config";
import {formatBytes} from "../../util/utils";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import RenameFile from "./RenameFile";
import Confirmation from "../../components/confirmation/Confirmation";

const useStyles = makeStyles(() => styles());

const FileHandler = () => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [files, setFiles] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [openRename, setOpenRename] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(null);
  const [users, setUsers] = useState([]);

  const {setLocalMsg, setLoading, mainData} = useContext(MainContext);

  const [selUser, setSelUser] = useState(mainData.user.id);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const loadFiles = () => {
    setLoading(true);
    const response = resp => {
      if (resp.response) {
        setFiles(resp.response);
      } else {
        setLocalMsg({message: 'Error loading files!', type: 'error'});
      }
      setLoading(false);
    };
    const URL = URL_USERS + `/${selUser}/paths${!mainData.user.isadmin && selUser !== mainData.user.id ? '?public=true' : ''}`;
    accessData(URL, response);
  };

  const rename = (id, newName) => {
    setLoading(true);
    const response = resp => {
      if (resp.response) {
        loadFiles();
        setLocalMsg({message: 'File renamed!', type: 'success'});
      } else {
        setLocalMsg({message: 'Error renaming file!', type: 'error'});
      }
      setLoading(false);
    };
    accessData(URL_USERS + `/${selUser}/paths/${id}/rename`, response, {}, 'PUT', {new_name: newName});
  };

  const deleteFile = id => {
    setLoading(true);
    const response = resp => {
      if (resp.response) {
        loadFiles();
        setLocalMsg({message: 'File deleted!', type: 'success'});
      } else {
        setLocalMsg({message: 'Error deleting file!', type: 'error'});
      }
      setLoading(false);
    };
    accessData(URL_USERS + `/${selUser}/paths/${id}`, response, {}, 'DELETE');
  };

  const changeStatus = id => {
    setLoading(true);
    const response = resp => {
      if (resp.response) {
        loadFiles();
        setLocalMsg({message: 'Status changed!', type: 'success'});
      } else {
        setLocalMsg({message: 'Error changing status!', type: 'error'});
      }
      setLoading(false);
    };
    accessData(URL_USERS + `/${selUser}/paths/${id}/change`, response, {}, 'PUT');
  };

  const loadUsers = () => {
    const response = resp => {
      if (resp.response) {
        setUsers(resp.response);
      } else {
        setLocalMsg({message: 'Error loading users!', type: 'error'});
      }
    };
    accessData(URL_USERS, response);
  };

  const download = id => {
    const response = resp => {
      if (resp.response) {
        const {url} = resp.response;
        window.location.assign(url);
      } else {
        setLocalMsg({message: 'Error downloading file!', type: 'error'});
      }
      setLoading(false);
    };
    accessData(URL_USERS + `/${selUser}/paths/${id}/download`, response, {}, 'GET');
  };

  const openContext = file => event => {
    event.preventDefault();
    setContextMenu({x: event.clientX - 2, y: event.clientY - 4, file});
  };

  const drawContextMenu = () => {
    const {x, y, file} = contextMenu;

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
          changeStatus(file.id);
          setContextMenu(null);
        }}>
          <Typography>
            {file.public === 'false' ? 'Make the file public' : 'Make the file private'}
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => {
          setOpenRename({previous: file.name, id: file.id});
          setContextMenu(null);
        }}>
          <Typography>
            {'Rename'}
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => {
          download(file.id);
        }}>
          <Typography>
            {'Download'}
          </Typography>
        </MenuItem>
        <Divider/>
        <MenuItem onClick={() => {
          setOpenConfirm({id: file.id, msg: `You are going to delete the file "${file.name}". Sure?`});
          setContextMenu(null);
        }}>
          <Typography>
            {'Delete file'}
          </Typography>
        </MenuItem>
      </Menu>
    );
  };

  useEffect(() => {
    if (users.length) {
      loadFiles();
    }
  }, [selUser])

  useEffect(() => {
    loadFiles();
    loadUsers();
  }, []);

  return (
    <Paper className={classes.paperRoot} elevation={4} style={{padding: '16px'}}>
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <UploadComp userId={selUser} setLocalMsg={setLocalMsg} notifyFinished={loadFiles} enabled={mainData.user.id === selUser}/>
        </Grid>
        <Grid item xs={7}>
          {users.length && (
            <Select
              id="selectEventName"
              fullWidth
              margin="dense"
              variant="outlined"
              value={selUser}
              onChange={e => { setSelUser(e.target.value); }}
              startAdornment={(
                <InputAdornment position="start">
                  Files from the user:
                </InputAdornment>
              )}
            >
              {users.map(user => <MenuItem value={user.id}>{user.username}</MenuItem>)}
            </Select>
          )}
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paperRoot} elevation={4}>
            <TableContainer className={clx(classes.containerFiles, classes.bordering)}>
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {'Name'}
                    </TableCell>
                    <TableCell>
                      {'Size'}
                    </TableCell>
                    <TableCell>
                      {'Is public'}
                    </TableCell>
                    <TableCell>
                      {'Created at'}
                    </TableCell>
                    <TableCell>
                      {'Updated at'}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {files.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(file => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={file.id} onContextMenu={openContext(file)}
                                className={classes.handPointer}>
                        <TableCell>
                          {file.name}
                        </TableCell>
                        <TableCell>
                          {formatBytes(+file.size)}
                        </TableCell>
                        <TableCell>
                          {file.public === 'false' ? 'No' : 'Yes'}
                        </TableCell>
                        <TableCell>
                          {(new Date(file.created_at)).toLocaleString('en')}
                        </TableCell><TableCell>
                        {(new Date(file.updated_at)).toLocaleString('en')}
                      </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 15, 25, 50, 100]}
              component="div"
              count={files.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Grid>
      {contextMenu && drawContextMenu()}
      {openRename && (
        <RenameFile
          handleClose={() => {
            setOpenRename(null);
          }}
          previousName={openRename.previous}
          setRename={newName => {
            rename(openRename.id, newName);
            setOpenRename(null);
          }}
        />)}
      {openConfirm && (
        <Confirmation
          message={openConfirm.msg}
          handleClose={() => {
            setOpenConfirm(null);
          }}
          handleOk={() => {
            deleteFile(openConfirm.id);
            setOpenConfirm(null);
          }}
        />
      )}
    </Paper>
  );
};

export default FileHandler;
