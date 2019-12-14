import React, { useState, useEffect, useLayoutEffect } from "react";
// import { Auth } from "aws-amplify";
import { makeStyles } from '@material-ui/core/styles';
import { Link, withRouter, useHistory } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Routes from "./Routes";
import "./App.css";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';

// Icons
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import BuildIcon from '@material-ui/icons/Build';
import MailIcon from '@material-ui/icons/Mail';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import Login from "./containers/Login";


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: "100vh",
    // backgroundColor: '#D80319',
  },
  menuButton: {
    marginRight: theme.spacing(5),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 300,
  },
}));

function App(props) {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [toggle, setToggleDrawer] = useState({ left: false });

  const [storageValue, setStorageValue] = useState(0);
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [specificAccount, setSpecificAccount] = useState("test");

  const [historyCount, setHistoryCount] = useState(0);



  const classes = useStyles();

  let history = useHistory();


  useEffect(() => {
    onLoad();
  }, []);

  useLayoutEffect(() => {
    crypto();
  }, []);

  async function crypto() {
    try {
      // Get network provider and web3 instance.
      console.log("crypto");

      const web3 = await getWeb3();

      setWeb3(!web3);

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      setContract(instance, await runExample(accounts, instance));
      // }, 3000);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  async function onLoad() {
    // try {
    //   // await Auth.currentSession();
    //   // userHasAuthenticated(true);
    // }
    // catch (e) {
    //   if (e !== 'No current user') {
    //     alert(e);
    //   }
    // }
    setIsAuthenticating(false);
    // console.log("onLoad finished");
  }

  async function runExample(accounts, contract) {
    console.log("runExample");
    // Stores a given value, 5 by default.
    await contract.methods.set(15).send({ from: accounts[0] });
    // console.log(accounts);
    // console.log(contract);

    setSpecificAccount(accounts[0])
    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    setStorageValue(response);
  };

  async function handleLogout() {
    // await Auth.signOut();
    userHasAuthenticated(false);
    console.log(props.history)
    props.history.push("/login");
  }

  function returnRouter() {
    if (historyCount.length === 0) {
      props.history.push("/notFound");
    }
    else {
      // console.log(historyCount.length)
      history.goBack();
    }
  }

  const toggleDrawer = (side, open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setToggleDrawer({ ...toggle, [side]: open });
  };

  const sideList = side => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <div style={{ backgroundColor: "#D80319", height: "100vh" }}>
        <List style={{ backgroundColor: "#D80319" }}>
          <ListItem button>
            <ListItemIcon>
              <LockOpenIcon style={{ fontSize: 40, color: "white" }} />
            </ListItemIcon>
            <ListItemText disableTypography style={{ fontSize: 30, color: "white", fontWeight: "bold" }}
              onClick={() => { history.push('/login') }} primary="Log In" />
          </ListItem>
        </List>
        <List style={{ backgroundColor: "#D80319" }}>
          <ListItem button>
            <ListItemIcon>
              <BuildIcon style={{ fontSize: 40, color: "white" }} />
            </ListItemIcon>
            <ListItemText disableTypography style={{ fontSize: 30, color: "white", fontWeight: "bold" }} primary="Hilti" />
          </ListItem>
        </List>
        <List style={{ backgroundColor: "#D80319" }}>
          <ListItem button>
            <ListItemIcon>
              <MailIcon style={{ fontSize: 40, color: "white" }} />
            </ListItemIcon>
            <ListItemText disableTypography style={{ fontSize: 30, color: "white", fontWeight: "bold" }} primary="Send Email" />
          </ListItem>
        </List>
        <List style={{ backgroundColor: "#D80319" }}>
          <ListItem button>
            <ListItemIcon>
              <ExitToAppIcon style={{ fontSize: 40, color: "white" }} />
            </ListItemIcon>
            <ListItemText disableTypography style={{ fontSize: 30, color: "white", fontWeight: "bold" }}
              onClick={handleLogout} primary="Log Out" />
          </ListItem>
        </List>
        <Divider />
        <List style={{ backgroundColor: "#D80319" }}>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ?
                  <InboxIcon style={{ fontSize: 40, color: "white" }} />
                  :
                  <MailIcon style={{ fontSize: 40, color: "white" }} />}
              </ListItemIcon>
              <ListItemText disableTypography style={{ fontSize: 30, color: "white", fontWeight: "bold" }} primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
      </div>
    </div>
  );

  return (
    // <div className="App container">
    <div className={classes.root}>
      <Drawer open={toggle.left} onClose={toggleDrawer('left', false)}>
        {sideList('left')}
      </Drawer>
      <AppBar position="static" style={{ heigth: '10vh' }}>
        <Toolbar style={{ backgroundColor: '#D80319' }}>
          {/* <IconButton onClick={history.goBack()} edge="start" className={classes.menuButton} color="inherit" aria-label="menu"> */}
          <IconButton onClick={returnRouter} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <KeyboardArrowLeftIcon style={{ fontSize: 40 }} />
          </IconButton>
          <IconButton onClick={toggleDrawer('left', true)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon style={{ fontSize: 40 }} />
          </IconButton>
          <Typography variant="h3" className={classes.title}>
            Menu
          </Typography>
          <Button style={{ fontSize: 18 }} color="inherit" onClick={() => { history.push('/login') }}>Login</Button>
        </Toolbar>
      </AppBar>
      {/* <Login></Login> */}
      {/* <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Scratch</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {isAuthenticated ? (
                <>
                  <LinkContainer to="/settings">
                    <NavItem>Settings</NavItem>
                  </LinkContainer>
                  <NavItem onClick={handleLogout}>Logout</NavItem>
                </>
              ) : (
                  <>
                    <LinkContainer to="/signup">
                      <NavItem>Signup</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/login">
                      <NavItem>Login</NavItem>
                    </LinkContainer>
                  </>
                )}
            </Nav>
          </Navbar.Collapse>
        </Navbar> */}
      <Routes appProps={{
        isAuthenticated, userHasAuthenticated, isAuthenticating, setIsAuthenticating,
        storageValue, contract, accounts, specificAccount
      }} />
    </div>
  );
}

export default withRouter(App);
