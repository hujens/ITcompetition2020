import React, { useState, useEffect } from "react";
// import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
// import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
// import { ListGroup, ListGroupItem, Button } from "react-bootstrap";
import "./StartPage.css";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { makeStyles } from '@material-ui/core/styles';


import Background from "../assets/startPage.jpg";


const useStyles = makeStyles(theme => ({
  root: {
    height: '90vh',
    backgroundImage: `url(${Background})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
}));

export default function StartPage(props) {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const classes = useStyles();

  useEffect(() => {
    async function onLoad() {
      try {
        // const notes = await loadNotes();
        const notes = { noteId: 1, content: "klasmdldkasd", createdAt: "24.01.2019" };
        setNotes(notes);
      } catch (e) {
        alert(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [props.isAuthenticated]);


  return (
    <Grid container component="main" className={classes.root}></Grid>
  );
}
