import React, { Component } from 'react';
import firebase from 'firebase';

class Login extends Component {
  handleGoogleLogin = (e) => {
    e.preventDefault();

    var provider = new firebase.auth.GoogleAuthProvider();
    
    firebase.auth().signInWithRedirect(provider);
    firebase.auth().getRedirectResult().then(function(result) {
      if (result.credential) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // var token = result.credential.accessToken;

        console.log('logged in with google: ', result);
      }
      // The signed-in user info.
      // var user = result.user;

    }).catch(function(error) {
      // Handle Errors here.
      // var errorCode = error.code;
      // var errorMessage = error.message;
      console.error(error)
      // The email of the user's account used.
      // var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      // var credential = error.credential;
      // ...
    });
  }

  render() {
    return (
      <div className="card">
        <button onClick={this.handleGoogleLogin}>Click here to login with your Google Account.</button>
      </div>
    );
  }
}

export default Login;