import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import dotenv from 'dotenv';
dotenv.config();


class App extends Component {

  state = {
    loggedIn: false
  }

  yesLoggedIn = () => {
    this.setState({
      loggedIn: true
    })
  }


  render() {
    return (

      <Router>
        <Switch>
          <ProtectedRoute exact path='/' loggedIn={this.state.loggedIn} component={Home} />
          <Route exact path='/login' render={(props) => <Login {...props} yesLoggedIn={this.yesLoggedIn} />} />
          <Route component={NoMatch} />
        </Switch>
      </Router>

    )
  }
}





const ProtectedRoute = ({ component: Comp, loggedIn, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        loggedIn ? (
          <Comp {...props} />
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
      }
    />
  );
};





export default App;
