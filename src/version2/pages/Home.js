import React, { Component } from 'react';

import LoginForms from './components/LoginForms';

class Home extends Component {
  render() {
    return (
      <div>
        <header>
          <h1>Home</h1>
        </header>
        <main>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sit vitae quibusdam recusandae adipisci animi doloribus maxime molestias nostrum, accusamus laudantium libero, a vero unde expedita. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates esse saepe iste. Optio, ea, asperiores.</p>

          {this.props.loggedIn ? null : <LoginForms /> }
        </main>
      </div>
    );
  }
}

export default Home;