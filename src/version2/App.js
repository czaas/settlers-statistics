import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';

import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyCk-IkfURqs327D30ysTnWRCWk06keRV8s",
  authDomain: "settlers-statisics.firebaseapp.com",
  databaseURL: "https://settlers-statisics.firebaseio.com/",
  storageBucket: "gs://settlers-statisics.appspot.com/",
  messagingSenderId: "settlers-statisics",
};
firebase.initializeApp(config);

import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Logout from './pages/Logout';

import Dashboard from './pages/Dashboard';
import ViewGame from './pages/ViewGame';

class App extends Component {
  state = {
    user: null,
    userLoggedIn: false,
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          userLoggedIn: true,
          user: user,
        });
      } else {
        this.setState({
          userLoggedIn: false,
          user: null,
        });
      }
    });
  }
  render() {
    let userStateLinks = (this.state.userLoggedIn) ?
      (<span><li><Link to="/dashboard">Dashboard</Link></li><li><Link to="/logout">Logout</Link></li></span>) :
      (<li><Link to="/login">Login</Link></li>);
    return (
      <Router>
        <div>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
              <hr />
            <ul>
              {userStateLinks}
            </ul>
          </nav>

          <Route exact path="/" component={Home} loggedIn={this.state.userLoggedIn} />
          <Route path="/about" component={About} />
          <Route path="/login" component={Login} loggedIn={this.state.userLoggedIn} />
          <Route path="/logout" component={Logout} loggedIn={this.state.userLoggedIn} />
          <PrivateRoute path="/dashboard" exact component={Dashboard} loggedIn={this.state.userLoggedIn} />
          <PrivateRoute path="/dashboard/game/:id" exact component={ViewGame} loggedIn={this.state.userLoggedIn} />
        </div>
      </Router>
    );
  }
}

const PrivateRoute = ({ component, ...rest }) => (
  <Route {...rest} render={props => (
    props.loggedIn ? (
      React.createElement(component, props)
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.path, id: props.match.params.id }
      }}/>
    )
  )}/>
);

export default App;