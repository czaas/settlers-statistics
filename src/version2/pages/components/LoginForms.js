import React, { Component } from 'react';

import LoginWithGoogle from './LoginWithGoogle';

class LoginForms extends Component {
  render() {
    return (
      <div className="login">
        <div className="login__form login__form--social">
          <LoginWithGoogle />
        </div>
        <div className="login__form login__form--email">
          Create an account or login via email.

          <form action="#0">
            <label htmlFor="email">
              Email
              <input type="email" id="email" />
            </label>
            <label htmlFor="password">
              Password
              <input type="password" id="password" />
            </label>
            <button>Sign In</button>
          </form>

        </div>
      </div>
    );
  }
}

export default LoginForms;
