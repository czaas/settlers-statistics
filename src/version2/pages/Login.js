import React, { Component } from 'react';

import LoginForms from './shared/LoginForms';

export default class Login extends Component {
  componentWillReceiveProps = (nextProps) => {
    // handles redirect if not logged in by default on initial load
    if (nextProps.loggedIn && this.props.location.state && this.props.location.state.from) {
      nextProps.push(this.props.location.state.from);
    } else if (nextProps.loggedIn) {
      nextProps.push('/dashboard');
    }
  }
  render() {
    console.log(this.props);
    return (
      <div> 
        <LoginForms />
      </div>
    );
  }
}
