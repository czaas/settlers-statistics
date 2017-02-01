import React, { Component } from 'react';
import firebase from 'firebase';

export default class Logout extends Component {

  componentDidMount = () => {
    setTimeout(() => {
      firebase.auth().signOut().then(() => {
        setTimeout(() => {
          this.props.push('/');
        }, 1500); 
      });
    }, 700); 
  }
  render() {
    return (
      <div>
        {(this.props.loggedIn) ? 'Logging out...' : 'You are now logged out. Redirecting...' }
      </div>
    );
  }
}
