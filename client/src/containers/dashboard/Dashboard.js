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

export default function Dashboard(appProps) {
  const classes = useStyles();

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeightChart);
  const fixedHeightDeposit = clsx(classes.paper, classes.fixedHeightDeposit);
  const fixedHeightDepositTop = clsx(classes.paper, classes.fixedHeightDepositTop);
  const fixedHeightDepositLast = clsx(classes.paper, classes.fixedHeightDepositLast);

  function preventDefault(event) {
    event.preventDefault();
  }

  async function uploadData() {
    try {
      await appProps.hiltiContract.methods.fetchToolData(appProps.accounts[3]).call().then(async (res) => {
        // toolData[_account].uploadRequest => true
        if (res[5]) {
          alert('This tool already requires data upload');
          await appProps.hiltiContract.methods.uploadData(appProps.accounts[3], Math.floor(Math.random() * 100) + 1).send({ from: appProps.accounts[1], gas: 1000000 }).then(async () => {
            await appProps.hiltiContract.methods.fetchUserData(appProps.accounts[1]).call().then(async (res) => {
              appProps.setCreditedAmount(res[2]);
              appProps.setCurrentDiscount(res[3]);
              await appProps.hiltiContract.methods.fetchToolData(appProps.accounts[3]).call().then(res => {
                console.log(res);
                appProps.setxAxes(res[2]);
                appProps.setyAxes(res[1]);
                blockchainListener();
              });
            });
          });
        }
        else {
          await appProps.hiltiContract.methods.requestUpload(appProps.accounts[3]).send({ from: appProps.accounts[0], gas: 1000000 }).then(async () => {
            await appProps.hiltiContract.methods.uploadData(appProps.accounts[3], Math.floor(Math.random() * 100) + 1).send({ from: appProps.accounts[1], gas: 1000000 }).then(async () => {
              await appProps.hiltiContract.methods.fetchUserData(appProps.accounts[1]).call().then(async (res) => {
                appProps.setCreditedAmount(res[2]);
                appProps.setCurrentDiscount(res[3]);
                await appProps.hiltiContract.methods.fetchToolData(appProps.accounts[3]).call().then(res => {
                  console.log(res);
                  appProps.setxAxes(res[2]);
                  appProps.setyAxes(res[1]);
                  blockchainListener();
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
    await appProps.hiltiContract.methods.claimTokens().send({ from: appProps.accounts[1], gas: 1000000 }).then(async () => {
      await appProps.hiltiContract.methods.fetchUserData(appProps.accounts[1]).call().then(async (res) => {
        appProps.setCreditedAmount(res[2]);
        appProps.setCurrentDiscount(res[3]);
        blockchainListener();
      });
    });
    await appProps.hiltiContract.methods.balanceOf(appProps.currentAccount).call().then(res => {
      appProps.setHiltiTokenStorage(res);
      blockchainListener();
    });
  }

  async function fetchToolData() {
    await appProps.hiltiContract.methods.fetchToolData(appProps.accounts[3]).call().then(res => {
      console.log(res);
      blockchainListener();
    })
  }

  function blockchainListener() {
    // Event Listener out of the Blockchain
    appProps.hiltiContract.getPastEvents("allEvents",
      {
        fromBlock: 'latest',
        toBlock: 'latest' // You can also specify 'latest'          
      })
      .then((events) => {
        console.log("blockchainListener")
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
    await appProps.hiltiContract.methods.redeemDiscount(2).send({ from: appProps.currentAccount }).then(async () => {
      await appProps.hiltiContract.methods.fetchUserData(appProps.currentAccount).call().then(async (res) => {
        appProps.setCreditedAmount(res[2]);
        appProps.setCurrentDiscount(res[3]);
        await appProps.hiltiContract.methods.balanceOf(appProps.currentAccount).call().then(res => {
          appProps.setHiltiTokenStorage(res);
        });
      });
    });
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <main className={classes.content}>
        <Container maxWidth="lg" className={classes.container}>
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
                    <Button style={{ marginLeft: 15, marginTop: 15 }} variant="contained" onClick={discounting}>Get Discount</Button>
                    <Button style={{ marginLeft: 15, marginTop: 15 }} variant="contained" onClick={discounting}>Sending</Button>
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
                    <Button style={{ marginLeft: 15 }} variant="contained" onClick={fetchToolData}>Fetch Tool Data</Button>
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
