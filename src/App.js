import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core";
import styles from "./containers/styling";
import MainContext from "./containers/common/MainContext";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Application from "./containers/application/Application";
import Login from "./containers/user/Login";
import Working from "./components/Loading/Working";
import LocalMsg from "./components/messages/LocalMsg";
import {createBrowserHistory} from 'history';

const useStyles = makeStyles(() => styles());

function App() {
  const classes = useStyles();
  const [mainData, setMainData] = useState({});
  const [loading, setLoading] = useState(false);
  const [localMsg, setLocalMsg] = useState(null);

  const renderLoading = () => (<Working open={loading}/>);
  const renderLocalMsg = () => (<LocalMsg
    handleClose={() => {
      setLocalMsg(null);
    }}
    message={localMsg.message}
    type={localMsg.type}
  />);

  useEffect(() => {
    const history = createBrowserHistory();
    history.push('/')
  }, []);

  if (!mainData.user) {
    return (
      <>
        <Login
          setLocalMsg={setLocalMsg}
          setLoading={setLoading}
          setLogin={pload => {
            setMainData({...mainData, user: pload});
          }}
        />
        {loading && renderLoading()}
        {localMsg && renderLocalMsg()}
      </>
    );
  }

  const logOut = () => {
    const main = {...mainData};
    delete main.user;
    setMainData(main);
  };

  return (
    <div className={classes.main}>
      <MainContext.Provider value={{mainData, setMainData, logOut, setLoading, setLocalMsg}}>
        <Router>
          <Switch>
            <Route path="/" component={Application}/>
          </Switch>
        </Router>
      </MainContext.Provider>
      {loading && renderLoading()}
      {localMsg && renderLocalMsg()}
    </div>
  );
}

export default App;
