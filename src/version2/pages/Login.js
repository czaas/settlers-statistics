import React, { Component } from 'react';

import LoginForms from './shared/LoginForms';

export default class Login extends Component {
  componentWillReceiveProps = (nextProps) => {
    // handles redirect if not logged in by default on initial load
    if (nextProps.loggedIn && this.props.location.state && this.props.location.state.from) {

      let id = '';
      let redirectUrl = this.props.location.state.from;

      if (redirectUrl.indexOf(':id') !== -1 && this.props.location.state.id) {
        id = this.props.location.state.id;
        redirectUrl = redirectUrl.replace(':id', id);
      }

      nextProps.push(redirectUrl);
    } else if (nextProps.loggedIn) {
      nextProps.push('/dashboard');
    }
  }
  render() {
    return (
      <div> 
        <LoginForms />
      </div>
    );
  }
}
