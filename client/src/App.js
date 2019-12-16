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
import Web3 from "web3";

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
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [toggle, setToggleDrawer] = useState({ left: false });
  const [LoginOrLogout, setLoginOrLogout] = useState("Login");

  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [metaMaskAccount, setmetaMaskAccount] = useState(null);

  // Account Props => siehe HiltiContract
  const [currentAccount, setcurrentAccount] = useState(null);
  const [toolList, settoolList] = useState(null);
  const [hiltiTokenStorage, setHiltiTokenStorage] = useState(0);
  const [creditedAmount, setCreditedAmount] = useState(0);
  const [currentDiscount, setCurrentDiscount] = useState(0);


  const [hiltiContract, sethiltiContract] = useState(null);
  const [hiltiContractAccount, sethiltiContractAccount] = useState(null);

  const [historyCount, setHistoryCount] = useState(0);

  // Data for Chart
  const [xAxes, setxAxes] = useState(new Array());
  const [yAxes, setyAxes] = useState(new Array());

  // Data for Event Listener
  const [events, setEvents] = useState(new Array());




  const classes = useStyles();

  let history = useHistory();

  // window.ethereum.on('accountsChanged', function (accounts) {
  //   // Time to reload your interface with accounts[0]!
  //   console.log(accounts);
  // })

  useEffect(() => {
    // onLoad();
  }, []);

  useLayoutEffect(() => {
    crypto();
  }, []);

  async function crypto() {
    try {
      // Get network provider and web3 instance.
      console.log("crypto");

      const web3Metamask = await getWeb3();

      setWeb3(!web3Metamask);

      // Use web3 to get the user's accounts.
      const metamaskUser = await web3Metamask.eth.getAccounts();
      setmetaMaskAccount(metamaskUser);

      // Get all Ganache Accounts for testing
      // For Production/Main Net not needed
      const provider = new Web3.providers.HttpProvider(
        "http://127.0.0.1:7545"
      );
      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);
      sethiltiContractAccount(accounts[0]);


      // accounts.forEach(account => {
      //   console.log(account);
      // });
      // console.log(metamaskUser);

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      console.log("networkId");
      console.log(networkId);

      const deployedNetworkHilti = HiltiContract.networks[networkId];
      console.log("deployedNetworkHilti");
      console.log(deployedNetworkHilti);

      const hiltiContractInstance = new web3.eth.Contract(
        HiltiContract.abi,
        deployedNetworkHilti && deployedNetworkHilti.address,
      );

      sethiltiContract(hiltiContractInstance);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // setContract(instance, await runExample(accounts, instance));

      // sethiltiContract(hiltiContract, await runExampleHilti(accounts, hiltiContract));
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
        // Login or Logout
        LoginOrLogout, setLoginOrLogout,
        // Auth Helpers
        isAuthenticated, userHasAuthenticated, isAuthenticating, setIsAuthenticating,
        // current Account => wird bei Login gesetzt
        currentAccount, setcurrentAccount,
        // wird für current Account gebraucht
        hiltiTokenStorage, setHiltiTokenStorage,
        creditedAmount, setCreditedAmount,
        currentDiscount, setCurrentDiscount,
        // Netzwerk Props
        hiltiContract, hiltiContractAccount, accounts,
        // data
        xAxes, setxAxes, yAxes, setyAxes, events, setEvents
      }} />
    </div>
  );
}

export default withRouter(App);
