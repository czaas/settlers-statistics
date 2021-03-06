import React from 'react';
import { Router, Route, IndexRoute, hashHistory, Link } from 'react-router';
import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyCk-IkfURqs327D30ysTnWRCWk06keRV8s",
  authDomain: "settlers-statisics.firebaseapp.com",
  databaseURL: "https://settlers-statisics.firebaseio.com/",
  storageBucket: "gs://settlers-statisics.appspot.com/",
  messagingSenderId: "settlers-statisics",
};
firebase.initializeApp(config);

import Home from './pages/Home';
import NewGame from './pages/NewGame';
import PlayGame from './pages/PlayGame';
import ViewGames from './pages/ViewGames';
import ViewSingleGame from './pages/ViewSingleGame';

class Wrapper extends React.Component {
  constructor() {
    super();

    this.state = {
      userLoggedIn: false,
      user: null,
      redirectPath: window.location.pathname,
      menuOpen: false,
    };
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
    })
  }
  toggleMenu = () => {
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  }
  render() {
    return (
      <div className={`app app--mmenu-${ this.state.menuOpen ? 'open' : 'closed' }`}>
        <nav className="app__gnav" onClick={this.toggleMenu}>
          <h1>Settlers Statistics</h1>
          <div className='links'>
            <Link to="/">Home</Link> <Link to="/new-game">New Game</Link> <Link to="/view-game/">Previous Games</Link>
          </div>
        </nav>
        <div className="app__topbar">
          <div className='menu-icon' onClick={this.toggleMenu}>
            <div className='menu-icon__bar' />
            <div className='menu-icon__bar' />
            <div className='menu-icon__bar' />
          </div>
        </div>
        <div className="app__content">
          {React.Children.map(this.props.children, (child) => {
            return React.cloneElement(child, {
              userLoggedIn: this.state.userLoggedIn,
              user: this.state.user,
            })
          })}
        </div>
      </div>
    )
  }
}

class App extends React.Component {

  authOnEnter = (event) => {
    
  }

  render() {
    return (
      <div>
        <Router history={hashHistory}>
          <Route path="/" component={Wrapper}>
            <IndexRoute component={Home} />
            <Route path="new-game" component={NewGame} onEnter={this.authOnEnter} />
            <Route path="play-game/:id" component={PlayGame} />
            <Route path="view-game/" component={ViewGames} />
            <Route path="view-game/:id" component={ViewSingleGame} />
          </Route>
        </Router>
      </div>
    );
  }
}


export default App;
