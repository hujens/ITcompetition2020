import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

import Home from "./containers/Home";
import Login from "./containers/Login";
import StartPage from "./containers/StartPage";

// import Notes from "./containers/Notes";
// import Signup from "./containers/Signup";
// import NewNote from "./containers/NewNote";
// import Settings from "./containers/Settings";
import NotFound from "./containers/NotFound";

// in appProps ist alles gespeicher => state = { storageValue: 0, web3: null, accounts: null, contract: null, isAuthenticating: true, isAuthenticated: false };
export default function Routes({ appProps }) {
  console.log("Routes");
  return (
    <Switch>
      {/* <div>
      <h1>{appProps.specificAccount}</h1>
      <h1>{appProps.storageValue}</h1>
      </div> */}
      
      {/* <h1>{appProps.contract.address}</h1> */}
      {/* <h1>{appProps.specificAccount}</h1> */}
      <UnauthenticatedRoute path="/" exact component={StartPage} appProps={appProps} />
      <UnauthenticatedRoute path="/login" exact component={Login} appProps={appProps} />
      <AuthenticatedRoute path="/home" exact component={Home} appProps={appProps} />



      {/* <UnauthenticatedRoute path="/signup" exact component={Signup} appProps={appProps} /> */}
      {/* <AuthenticatedRoute path="/settings" exact component={Settings} appProps={appProps} /> */}
      {/* <AuthenticatedRoute path="/notes/new" exact component={NewNote} appProps={appProps} /> */}
      {/* <AuthenticatedRoute path="/notes/:id" exact component={Notes} appProps={appProps} /> */}
      {/* Finally, catch all unmatched routes */}
      <Route component={NotFound} />
    </Switch>
  );
}
