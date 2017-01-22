import React from 'react';
import { Link } from 'react-router';

import LoginWithGoogle from './LoginWithGoogle';

const HomeContent = ( props ) => (
  <ul>
    <li><Link to="/new-game">New Game</Link></li>
    <li><Link to={`/view-game/`}>View and compare previous game stats</Link></li>
  </ul>
);

class Home extends React.Component {

  render() {

    let content = (this.props.userLoggedIn) ? <HomeContent /> : <LoginWithGoogle />;

    return (
      <div>
        <h1>Settlers Statistics</h1>
        <p>Keep Track of each games dice rolls, victors, and achievments.</p>

        { content }
      </div>
    );
  }
}

export default Home;