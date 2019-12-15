import React, { useEffect } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './dashboard/subContainers/Title';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Deposits({ appProps }) {
  const classes = useStyles();

  useEffect(() => {
    console.log("useEffect");
    // console.log(appProps.storageValue);
  }, []);

  return (
    <React.Fragment>
      <h2>{appProps.title1}</h2>
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
  );
}