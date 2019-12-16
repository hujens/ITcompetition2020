import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Background from "../assets/poster.jpg";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';



const useStyles = makeStyles(theme => ({
    root: {
        height: '94vh',
    },
    image: {
        backgroundImage: `url(${Background})`,
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(20, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: '#D80319',
    },
    form: {
        width: '50%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        height: '40px',
    },
}));

// const Transition = React.forwardRef(function Transition(props, ref) {
//     return <Slide direction="up" ref={ref} {...props} />;
// });

export default function Login(props) {
    const classes = useStyles();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        onLoad();
    }, []);

    async function onLoad() {
        if (props.isAuthenticated) {
            props.history.push("/dashboard");
            props.setLoginOrLogout("Logout");
            props.setIsAuthenticating(false);
        }
        else {
            props.setIsAuthenticating(true);
        }
        // try {
        //   // await Auth.currentSession();
        //   // userHasAuthenticated(true);
        // }
        // catch (e) {
        //   if (e !== 'No current user') {
        //     alert(e);
        //   }
        // }
        // console.log("onLoad finished");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            // await Auth.signIn(fields.email, fields.password);
            if (email === "test@test.com" && password === "test") {
                props.userHasAuthenticated(true)
                props.history.push("/dashboard");
                props.setLoginOrLogout("Logout");
                props.setcurrentAccount(props.accounts[1]);
                await props.hiltiContract.methods.fetchUserData(props.accounts[1]).call().then(async (res) => {
                    console.log(res);
                    if (res[0] === "0x0000000000000000000000000000000000000000") {
                        alert(
                            `User not exist on the Blockchain => Creating a new one`,
                        );
                        try {
                            console.log(props.accounts[1]);
                            await props.hiltiContract.methods.addUser(props.accounts[1], "Bob").send({ from: props.accounts[0] }).then(async () => {
                                console.log("addUser");
                                await props.hiltiContract.methods.addTool(props.accounts[3], "Hilti Saebelsaegen - WSR 22-A").send({ from: props.accounts[0], gas: 1000000 }).then(async (res) => {
                                    console.log("addTool");
                                    console.log(res);
                                    await props.hiltiContract.methods.registerTool(props.accounts[1], props.accounts[3])
                                        .send({ from: props.accounts[0], gas: 1000000 }).then(async () => {
                                            console.log("registerTool");
                                            await props.hiltiContract.methods.requestUpload(props.accounts[3]).send({ from: props.accounts[0], gas: 1000000 }).then(async () => {
                                                console.log("requestUpload");
                                                // als erstes Tool Daten holen
                                                await props.hiltiContract.methods.fetchToolData(props.accounts[3]).call().then(res => {
                                                    console.log(res);
                                                    props.setxAxes(res[2]);
                                                    props.setyAxes(res[1]);
                                                    blockchainListener();
                                                });
                                            });
                                        });
                                });
                            });
                        } catch (e) {
                            alert(e.message);
                            console.log(e);
                        }
                    }
                    else {
                        props.setCreditedAmount(res[2]);
                        props.setCurrentDiscount(res[3]);
                        await props.hiltiContract.methods.balanceOf(props.accounts[1]).call().then(async (res) => {
                            props.setHiltiTokenStorage(res);
                            await props.hiltiContract.methods.fetchToolData(props.accounts[3]).call().then(res => {
                                console.log(res);
                                props.setxAxes(res[2]);
                                props.setyAxes(res[1]);
                                blockchainListener();
                            });
                        })
                    }
                });
            }
            else if (email === "test@test.com" && password === "test") {
                // To do for other user account
            }
            else {
                handleClickOpen()
            }
        } catch (e) {
            alert(e.message);
            // setIsLoading(false);
        }
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function blockchainListener() {
        // Event Listener out of the Blockchain
        props.hiltiContract.getPastEvents("allEvents",
            {
                fromBlock: 'latest',
                toBlock: 'latest' // You can also specify 'latest'          
            })
            .then((events) => {
                console.log("blockchainListener")
                var tempData = props.events
                const data = createData(events[0].id, events[0].type, events[0].event, events[0].blockNumber, events[0].blockHash);
                tempData.push(data);
                props.setEvents(tempData);
                console.log(props.events)
            }
            );
    }

    function createData(id, type, event, blockNumber, blockHash) {
        return { id, type, event, blockNumber, blockHash };
    }

    return (
        <div>
            <Dialog
                open={open}
                // TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"Wrong Password"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Please make sure your password and email provided is correct
          </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Agree
          </Button>
                </DialogActions>
            </Dialog>
            <Grid container component="main" className={classes.root}>
                <CssBaseline />
                <Grid item xs={false} sm={4} md={7} className={classes.image} />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
          </Typography>
                        <form className={classes.form} noValidate onSubmit={handleSubmit}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autoFocus
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Sign In
            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="#" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                            <Box mt={5}>
                                <Copyright />
                            </Box>
                        </form>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="http://ic.ibi.ethz.ch/">
                Your Website
      </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}