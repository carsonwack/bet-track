import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from "react-router-dom";
import { GoogleLogin } from 'react-google-login';
import API from './utils/API';
import Home from './pages/Home';
import Login from './pages/Login';
import dotenv from 'dotenv';
dotenv.config();


class App extends Component {

  state = {
    isAuthenticated: false
  }

  yesAuthenticated = () => {
    this.setState({ isAuthenticated: true })
  }


  render() {
    return (
        <Router>
          <div>
            <ul>
              <li><Link to='/login'>Login Page</Link></li>
              <li><Link to='/home'>Home Page</Link></li>
            </ul>
            <Route path='/login' render={() => <Login yesAuthenticated={this.yesAuthenticated} />} />
            <Route path='/home' component={Home} />
          </div>
        </Router>
    )
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    this.state.isAuthenticated ? <Component {...props} /> : <Redirect to='/login' />
  )} />
)


export default App;
