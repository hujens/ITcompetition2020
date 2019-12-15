import React from 'react';
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

import Upload from "../upload/Upload";
import "./Dashboard.css";


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
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
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
    marginTop: 35,
  },
  fixedHeightDepositTop: {
    height: 160,
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


  function preventDefault(event) {
    event.preventDefault();
  }

  async function sendCrypto() {
    await appProps.contract.methods.set(30).send({ from: appProps.accounts[0] }).then(async () => {
      await appProps.contract.methods.get().call().then(res => {
        appProps.setStorageValue(res);
        console.log("sendCrypto");
        console.log(res);
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
                <Chart />
              </Paper>
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightDepositTop}>
                <React.Fragment>
                  <Title>Deposits Ethereum</Title>
                  <Typography component="p" variant="h4">
                    <h3>{appProps.storageValue}</h3>
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
              <Paper className={fixedHeightDeposit}>
                <React.Fragment>
                  <Title>Deposits HILTI Token</Title>
                  <Typography component="p" variant="h4">
                    <h3>{appProps.storageValue}</h3>
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
              <Paper className={fixedHeightDeposit}>
                <React.Fragment>
                  <Title>Deposits HILTI Token</Title>
                  <Typography component="p" variant="h4">
                    <h3>{appProps.storageValue}</h3>
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
            </Grid>
            {/* <Grid item xs={12}>
              <div className="Card">
                <Upload />
              </div>
            </Grid> */}
            {/* Recent Orders */}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Orders />
              </Paper>
            </Grid>
          </Grid>
        </Container>
        <Button style={{ fontSize: 18 }} color="inherit" onClick={sendCrypto}></Button>
      </main>
    </div>
  );
}
