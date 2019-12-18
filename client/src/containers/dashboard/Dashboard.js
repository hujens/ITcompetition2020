import React, { useState, useLayoutEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Chart from './subContainers/Chart';
import Deposits from '../Deposits';
import Orders from '../Orders';
import Title from './subContainers/Title';

// Dialog

import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import { blue } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';



const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  content: {
    flexGrow: 1,
    height: '94vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeightChart: {
    height: 550,
  },
  fixedHeightDeposit: {
    height: 160,
    marginTop: 5,
  },
  fixedHeightDepositTop: {
    height: 200,
  },
  fixedHeightDepositLast: {
    marginTop: 5,
    height: 200,
  },
  depositContext: {
    flex: 1,
  },
}));

SimpleDiscountInput.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedDiscount: PropTypes.number.isRequired,
  setSelectedDiscount: PropTypes.func.isRequired,
};

const useStylesDiscount = makeStyles({
});

// Input Discount Dialog
function SimpleDiscountInput(props) {
  const classes = useStylesDiscount();
  const { onClose, selectedDiscount, open, setSelectedDiscount } = props;

  // const handleClose = () => {
  //   onClose();
  // };

  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Set Your Discount</DialogTitle>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField style={{ margin: 15 }} pattern="[0-9]*" id="filled-basic" label="Filled" variant="filled"
          onChange={(e) => setSelectedDiscount(e.target.value)} value={selectedDiscount} />
        <Button style={{ margin: 15, marginTop: 25 }} variant="contained" onClick={onClose} >Get Discount</Button>
      </form>
    </Dialog>
  );
}

SimpleDialogInput.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedAmount: PropTypes.number.isRequired,
  setSelectedAmount: PropTypes.func.isRequired,
};

const useStyles3 = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

// Input Dialog
function SimpleDialogInput(props) {
  const classes = useStyles3();
  const { onClose, selectedAmount, open, setSelectedAmount } = props;

  // const handleClose = () => {
  //   onClose();
  // };

  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Set Your Sending Amount</DialogTitle>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField style={{ margin: 15 }} pattern="[0-9]*" id="filled-basic" label="Filled" variant="filled"
          onChange={(e) => setSelectedAmount(e.target.value)} value={selectedAmount} />
        <Button style={{ margin: 15, marginTop: 25 }} variant="contained" onClick={onClose} >Sending</Button>
      </form>
    </Dialog>
  );
}

const useStyles4 = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

// Dialog
function SimpleDialog(props) {
  const classes = useStyles4();
  const { onClose, selectedValue, open, accountsName, accountsAddress } = props;
  // console.log(props.appProps.accounts);

  const handleClose = () => {
    onClose(null);
  };

  const handleListItemClick = index => {
    onClose(accountsAddress[index]);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Set your sending adress</DialogTitle>
      <List>
        {props.accountsName.map((accountName, index) => (
          <ListItem button onClick={() => handleListItemClick(index)} key={index}>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={accountName} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
  accountsName: PropTypes.array.isRequired,
  accountsAddress: PropTypes.array.isRequired
};

export default function Dashboard(appProps) {
  const classes = useStyles();

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeightChart);
  const fixedHeightDeposit = clsx(classes.paper, classes.fixedHeightDeposit);
  const fixedHeightDepositTop = clsx(classes.paper, classes.fixedHeightDepositTop);
  const fixedHeightDepositLast = clsx(classes.paper, classes.fixedHeightDepositLast);

  // Dialog Data
  const [open, setOpen] = React.useState(false);
  const [openInput, setOpenInput] = React.useState(false);
  const [openDiscount, setopenDiscount] = React.useState(false);
  const [accountsName, setAccountsName] = React.useState(new Array());
  const [accountsAddress, setAccountsAddress] = React.useState(new Array());


  const [selectedValue, setSelectedValue] = React.useState('');
  const [selectedAmount, setSelectedAmount] = React.useState(0);
  const [selectedDiscount, setSelectedDiscount] = React.useState(0);



  const handleClickOpen = async () => {
    var accountsName = new Array();
    var accountsAddress = new Array();
    for await (const account of appProps.accounts) {
      await appProps.hiltiContract.methods.fetchUserData(account).call().then(async (res) => {
        console.log(res);
        if (res[0] === "0x0000000000000000000000000000000000000000") {
          accountsName.push("Not Available");
          accountsAddress.push(0);
        }
        else {
          accountsName.push(res[4]);
          accountsAddress.push(res[0]);
        }
      });
    }
    setAccountsName(accountsName);
    setAccountsAddress(accountsAddress);
    setOpen(true);
  };

  const handleClickOpenDiscount = () => {
    setopenDiscount(true);
  };

  const handleClose = value => {
    setOpen(false);
    console.log(value);
    if (value) {
      setSelectedValue(value);
      setOpenInput(true);
    }
    else {
      setOpen(false);
    }

  };

  const sendingTokens = async () => {
    setOpenInput(false);
    console.log(selectedAmount);
    console.log(selectedValue);

    if (selectedAmount > 0) {
      try {
        // console.log(selectedValue);
        await appProps.hiltiContract.methods.transferTokens(selectedValue, selectedAmount).send({ from: appProps.currentAccount }).then(async (res) => {
          blockchainListener();
          // console.log(res.to);
          await appProps.hiltiContract.methods.fetchUserData(selectedValue).call().then(async (ress) => {
            console.log(ress);
            await appProps.hiltiContract.methods.fetchUserData(appProps.currentAccount).call().then(async (resss) => {
              console.log(ress);
              alert(resss[4] + " sended " + selectedAmount + " to " + ress[4]);
              await appProps.hiltiContract.methods.fetchUserData(appProps.accounts[1]).call().then(async (res) => {
                appProps.setCreditedAmount(res[2]);
                appProps.setCurrentDiscount(res[3]);
              });
              await appProps.hiltiContract.methods.balanceOf(appProps.currentAccount).call().then(res => {
                appProps.setHiltiTokenStorage(res);
                setSelectedValue('');
                setSelectedAmount(0);
              });
            });
          });
        });
      } catch (e) {
        alert(e.message);
      }
    }
    else {
      return null
    }

  }
  // Ende Dialog Data

  function preventDefault(event) {
    event.preventDefault();
  }

  async function uploadData() {
    try {
      await appProps.hiltiContract.methods.fetchToolData(appProps.currentToolAccount).call().then(async (res) => {
        // toolData[_account].uploadRequest => true
        if (res[5]) {
          alert('This tool already requires data upload');
          await appProps.hiltiContract.methods.uploadData(appProps.currentToolAccount, Math.floor(Math.random() * 100) + 1).send({ from: appProps.currentAccount, gas: 1000000 }).then(async () => {
            blockchainListener();
            await appProps.hiltiContract.methods.fetchUserData(appProps.currentAccount).call().then(async (res) => {
              appProps.setCreditedAmount(res[2]);
              appProps.setCurrentDiscount(res[3]);
              await appProps.hiltiContract.methods.fetchToolData(appProps.currentToolAccount).call().then(res => {
                console.log(res);
                appProps.setxAxes(res[2]);
                appProps.setyAxes(res[1]);
              });
            });
          });
        }
        else {
          await appProps.hiltiContract.methods.requestUpload(appProps.currentToolAccount).send({ from: appProps.accounts[0], gas: 1000000 }).then(async () => {
            await appProps.hiltiContract.methods.uploadData(appProps.currentToolAccount, Math.floor(Math.random() * 100) + 1).send({ from: appProps.currentAccount, gas: 1000000 }).then(async () => {
              blockchainListener();
              await appProps.hiltiContract.methods.fetchUserData(appProps.currentAccount).call().then(async (res) => {
                appProps.setCreditedAmount(res[2]);
                appProps.setCurrentDiscount(res[3]);
                await appProps.hiltiContract.methods.fetchToolData(appProps.currentToolAccount).call().then(res => {
                  console.log(res);
                  appProps.setxAxes(res[2]);
                  appProps.setyAxes(res[1]);
                });
              });
            });
          });
        }
      });
    }
    catch (e) {
      alert(e.message);
    }

  }

  async function claiming() {
    await appProps.hiltiContract.methods.claimTokens().send({ from: appProps.currentAccount, gas: 1000000 }).then(async () => {
      await appProps.hiltiContract.methods.fetchUserData(appProps.currentAccount).call().then(async (res) => {
        appProps.setCreditedAmount(res[2]);
        appProps.setCurrentDiscount(res[3]);
        blockchainListener();
      });
    });
    await appProps.hiltiContract.methods.balanceOf(appProps.currentAccount).call().then(res => {
      appProps.setHiltiTokenStorage(res);
    });
  }

  async function fetchToolData() {
    await appProps.hiltiContract.methods.fetchToolData(appProps.currentToolAccount).call().then(res => {
      console.log(res);
    })
  }

  function blockchainListener() {
    // Event Listener out of the Blockchain
    appProps.hiltiContract.getPastEvents("allEvents",
      {
        // fromBlock: 'latest',
        toBlock: 'latest' // You can also specify 'latest'          
      })
      .then((events) => {
        console.log("blockchainListener")
        // console.log(appProps.events);
        var tempData = appProps.events
        const data = createData(events[0].id, events[0].type, events[0].event, events[0].blockNumber, events[0].blockHash);
        tempData.push(data);
        appProps.setEvents(tempData);
        console.log(appProps.events)
      }
      );
  }

  function createData(id, type, event, blockNumber, blockHash) {
    return { id, type, event, blockNumber, blockHash };
  }

  async function discounting() {
    if (selectedDiscount > 0) {
      try {
        await appProps.hiltiContract.methods.redeemDiscount(selectedDiscount).send({ from: appProps.currentAccount }).then(async () => {
          await appProps.hiltiContract.methods.fetchUserData(appProps.currentAccount).call().then(async (res) => {
            appProps.setCreditedAmount(res[2]);
            appProps.setCurrentDiscount(res[3]);
            await appProps.hiltiContract.methods.balanceOf(appProps.currentAccount).call().then(res => {
              appProps.setHiltiTokenStorage(res);
              setopenDiscount(false);
              setSelectedDiscount(0);
            });
          });
        });
      } catch (e) {
        alert(e.message);
      }
    }
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <main className={classes.content}>
        <Container maxWidth="lg" className={classes.container}>
          <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} appProps={appProps} accountsName={accountsName} accountsAddress={accountsAddress} />
          <SimpleDialogInput selectedAmount={selectedAmount} setSelectedAmount={setSelectedAmount} open={openInput} onClose={sendingTokens} appProps={appProps} />
          <SimpleDiscountInput selectedDiscount={selectedDiscount} setSelectedDiscount={setSelectedDiscount} open={openDiscount} onClose={discounting} appProps={appProps} />
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                <Chart appProps={appProps} />
              </Paper>
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightDepositTop}>
                <React.Fragment>
                  <Title>HILTI TOKEN</Title>
                  <Typography component="div" variant="h4">
                    <div>
                      <h3>{appProps.hiltiTokenStorage}</h3>
                    </div>
                  </Typography>
                  <Typography color="textSecondary" className={classes.depositContext}>
                    {new Date().getDate()}{'.'}{new Date().getMonth()}{'.'}{new Date().getFullYear()}{'.'}
                  </Typography>
                  <div>
                    <Link color="primary" href="#" onClick={preventDefault}>
                      View balance
                    </Link>
                  </div>
                  <div>
                    <Button style={{ marginLeft: 15, marginTop: 15 }} variant="contained" onClick={handleClickOpenDiscount}>Get Discount</Button>
                    <Button style={{ marginLeft: 15, marginTop: 15 }} variant="contained" onClick={handleClickOpen}>Sending</Button>
                  </div>
                </React.Fragment>
              </Paper>
              <Paper className={fixedHeightDeposit}>
                <React.Fragment>
                  <Title>Current Discount</Title>
                  <Typography component="div" variant="h4">
                    <div>
                      <h3>{appProps.currentDiscount}%</h3>
                    </div>
                  </Typography>
                  <Typography color="textSecondary" className={classes.depositContext}>
                    {new Date().getDate()}{'.'}{new Date().getMonth()}{'.'}{new Date().getFullYear()}{'.'}
                  </Typography>
                  <div>
                    <Link color="primary" href="#" onClick={preventDefault}>
                      View balance
                    </Link>
                  </div>
                </React.Fragment>
              </Paper>
              <Paper className={fixedHeightDepositLast}>
                <React.Fragment>
                  <Title>Credited HILTI Token</Title>
                  <Typography component="div" variant="h4">
                    <div>
                      <h3>{appProps.creditedAmount}</h3>
                    </div>
                  </Typography>
                  <Typography color="textSecondary" className={classes.depositContext}>
                    {new Date().getDate()}{'.'}{new Date().getMonth()}{'.'}{new Date().getFullYear()}{'.'}
                  </Typography>
                  <div>
                    <Link color="primary" href="#" onClick={preventDefault}>
                      View balance
                    </Link>
                  </div>
                  <div>
                    <Button style={{ marginLeft: 15, marginTop: 15 }} variant="contained" onClick={claiming}>Claiming</Button>
                    {/* <Button style={{ marginLeft: 15 }} variant="contained" onClick={fetchToolData}>Fetch Tool Data</Button> */}
                  </div>
                  {/* <Button style={{ fontSize: 18 }} color="inherit" ></Button> */}
                </React.Fragment>
              </Paper>
            </Grid>
            <Button style={{ marginLeft: 12, backgroundColor: "#a8aaff" }} variant="contained" onClick={uploadData}>Upload Data</Button>

            {/* <Grid item xs={12}>
              <div className="Card">
                <Upload />
              </div>
            </Grid> */}
            {/* Recent Orders */}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Orders appProps={appProps} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}

