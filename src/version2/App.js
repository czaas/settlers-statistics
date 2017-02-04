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
import NewGame from './pages/NewGame';
import PlayGame from './pages/PlayGame';

class App extends Component {
  state = {
    user: null,
    userLoggedIn: false,
    drawerOpen: false,
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

  toggleDrawer = (preference) => {

    let newDrawerState = !this.state.drawerOpen;

    if (typeof preference === 'boolean') {
      newDrawerState = preference;
    }

    this.setState({
      drawerOpen: newDrawerState,
    });
  }
  render() {
    let userStateLinks = () => {
      if (this.state.userLoggedIn) {
        return (
          <span>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/dashboard/new-game">New Game</Link></li>
            <li><Link to="/logout">Logout</Link></li>
          </span>
        );
      } else {
        return (
          <span>
            <li><Link to="/login">Login</Link></li>
          </span>
        );
      }
    }
    return (
      <Router>
        <div className={`app ${this.state.drawerOpen ? 'app--open' : ''}`}>
          <div className={`app__drawer ${this.state.drawerOpen ? 'app__drawer--open' : ''}`}>
            <nav className="app__drawer__nav">
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
              </ul>
                <hr />
              <ul>
                {userStateLinks()}
              </ul>
            </nav>
          </div>
          <div className={`app__shield  ${this.state.drawerOpen ? 'app__shield--open' : ''}`} onClick={this.toggleDrawer} />
          <div className="app__topnav">
            <i className="material-icons" onClick={this.toggleDrawer}>menu</i>
          </div>

          <Route exact path="/" component={Home} loggedIn={this.state.userLoggedIn} />
          <Route path="/about" component={About} />
          <Route path="/login" component={Login} loggedIn={this.state.userLoggedIn} />
          <Route path="/logout" component={Logout} loggedIn={this.state.userLoggedIn} />

          <PrivateRoute path="/dashboard" exact component={Dashboard} loggedIn={this.state.userLoggedIn} />
          <PrivateRoute path="/dashboard/game/:id" exact component={ViewGame} loggedIn={this.state.userLoggedIn} />
          <PrivateRoute path="/dashboard/play/:id" exact component={PlayGame} loggedIn={this.state.userLoggedIn} />

          <PrivateRoute path="/dashboard/new-game" exact component={NewGame} loggedIn={this.state.userLoggedIn} />
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