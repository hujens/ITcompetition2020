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
import getWeb3 from "./getWeb3";

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';

// Icons
import DashboardIcon from '@material-ui/icons/Dashboard';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PowerIcon from '@material-ui/icons/Power';

import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import BuildIcon from '@material-ui/icons/Build';
import MailIcon from '@material-ui/icons/Mail';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import Login from "./containers/Login";

// Contracts

// import SimpleStorageContract from "./contracts/SimpleStorage.json";
import HiltiContract from "./contracts/HiltiContract.json";



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
  const [isAuthenticated, userHasAuthenticated] = useState(true);
  const [toggle, setToggleDrawer] = useState({ left: false });
  const [LoginOrLogout, setLoginOrLogout] = useState("Login");


  const [storageValue, setStorageValue] = useState(0);
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [hiltiContract, sethiltiContract] = useState(null);

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

      accounts.forEach(account => {
        console.log(account);
      });

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      console.log("networkId");
      console.log(networkId);

      // const deployedNetwork = SimpleStorageContract.networks[networkId];
      // console.log("deployedNetwork");
      // console.log(deployedNetwork);

      // const instance = new web3.eth.Contract(
      //   SimpleStorageContract.abi,
      //   deployedNetwork && deployedNetwork.address,
      // );

      const deployedNetworkHilti = HiltiContract.networks[networkId];
      console.log("deployedNetworkHilti");
      console.log(deployedNetworkHilti);

      const hiltiContract = new web3.eth.Contract(
        HiltiContract.abi,
        deployedNetworkHilti && deployedNetworkHilti.address,
      );

      // console.log("instance // contract");
      // console.log(instance._address);
      // console.log(instance);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // setContract(instance, await runExample(accounts, instance));

      sethiltiContract(hiltiContract, await runExampleHilti(accounts, hiltiContract));
      // }, 3000);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
      // "0x62ee598361d54Bc21E4C923c873866AfeDA94aF8"
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
    // await contract.methods.set(15).send({ from: accounts[0] });
    // console.log(accounts);
    // console.log(contract);

    setSpecificAccount(accounts[0])
    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    setStorageValue(response);
  };

  async function runExampleHilti(accounts, contract) {
    console.log("runExampleHilti");
    console.log(contract);
    // Stores a given value, 5 by default.
    // const response = await contract.methods.get().call();
    // const response = await contract.methods.addUser(accounts[1]).send({ from: accounts[0] }).then(async (res) => {
    //   console.log("1");
    //   console.log(res);
    //   await contract.methods.addTool(accounts[5]).send({ from: accounts[0] }).then(async (res2) => {
    //     console.log("2");
    //     console.log(res2);
    //     await contract.methods.registerTool(accounts[1], accounts[5]).send({ from: accounts[0] }).then(async (res3) => {
    //       console.log("3");
    //       console.log(res3);
          const response = await contract.methods.fetchUserData(accounts[1]).call();
      //   });
      // });
      console.log();
    // });
    // console.log(accounts);
    // console.log(contract);

    // setSpecificAccount(accounts[0])
    // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    // Update state with the result.
    setStorageValue(response[0]);

  };

  async function handleLogout() {
    // await Auth.signOut();
    userHasAuthenticated(false);
    setLoginOrLogout("Login");
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
              <DashboardIcon style={{ fontSize: 40, color: "white" }} />
            </ListItemIcon>
            <ListItemText disableTypography style={{ fontSize: 30, color: "white", fontWeight: "bold" }}
              onClick={() => { history.push('/dashboard') }} primary="Dashboard" />
          </ListItem>
        </List>
        <List style={{ backgroundColor: "#D80319" }}>
          <ListItem button>
            <ListItemIcon>
              <AccountBalanceWalletIcon style={{ fontSize: 40, color: "white" }} />
            </ListItemIcon>
            <ListItemText disableTypography style={{ fontSize: 30, color: "white", fontWeight: "bold" }}
              onClick={() => { history.push('/balance') }} primary="Balance" />
          </ListItem>
        </List>
        <List style={{ backgroundColor: "#D80319" }}>
          <ListItem button>
            <ListItemIcon>
              <ShoppingCartIcon style={{ fontSize: 40, color: "white" }} />
            </ListItemIcon>
            <ListItemText disableTypography style={{ fontSize: 30, color: "white", fontWeight: "bold" }}
              onClick={() => { history.push('/orders') }} primary="Orders" />
          </ListItem>
        </List>
        <List style={{ backgroundColor: "#D80319" }}>
          <ListItem button>
            <ListItemIcon>
              <PowerIcon style={{ fontSize: 40, color: "white" }} />
            </ListItemIcon>
            <ListItemText disableTypography style={{ fontSize: 30, color: "white", fontWeight: "bold" }}
              onClick={() => { history.push('/tools') }} primary="Tools" />
          </ListItem>
        </List>

        <Divider disableTypography style={{ fontSize: 30, backgroundColor: "white", fontWeight: "bold" }} />

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

        <Divider disableTypography style={{ fontSize: 30, backgroundColor: "white", fontWeight: "bold" }} />

      </div>
    </div>
  );



  return (
    // <div className="App container">
    <div className={classes.root}>
      <h1>{storageValue}</h1>
      <Drawer open={toggle.left} onClose={toggleDrawer('left', false)}>
        {sideList('left')}
      </Drawer>
      <AppBar position="static" style={{ heigth: '10vh' }}>
        <Toolbar style={{ backgroundColor: '#D80319' }}>
          {/* <IconButton onClick={history.goBack()} edge="start" className={classes.menuButton} color="inherit" aria-label="menu"> */}
          <IconButton disabled={!isAuthenticated} onClick={returnRouter} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <KeyboardArrowLeftIcon style={{ fontSize: 40 }} />
          </IconButton>
          <IconButton disabled={!isAuthenticated} onClick={toggleDrawer('left', true)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon style={{ fontSize: 40 }} />
          </IconButton>
          <Typography variant="h3" className={classes.title}>
            Menu
          </Typography>
          <Button style={{ fontSize: 18 }} color="inherit" onClick={() => {
            if (isAuthenticated) {
              handleLogout();
            } else {
              history.push('/login')
            }
          }}>{LoginOrLogout}</Button>
        </Toolbar>
      </AppBar>
      <Routes appProps={{
        isAuthenticated, userHasAuthenticated, isAuthenticating, setIsAuthenticating,
        storageValue, setStorageValue, contract, accounts, specificAccount, LoginOrLogout, setLoginOrLogout
      }} />
    </div>
  );
}

export default withRouter(App);
