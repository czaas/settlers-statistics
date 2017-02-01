import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import SettlersStore from './_store';

class Dashboard extends Component {
  constructor() {
    super();
    this.store = new SettlersStore();

    this.state = {
      games: {},
    };
  }

  componentDidMount = () => {
    this.store.getGameList((games) => {
      this.setState({
        games
      });
    });
  }

  render() {
    let inProgressGames = [];
    let finishedGames = [];

    let games = Object.keys(this.state.games).map((key, index) => {
      let currentGame = this.state.games[key];
      let linkLocation = (currentGame.finished) ? 'game' : 'play';

      return <li key={`in-progress-link-${index}`}><Link to={`/dashboard/${ linkLocation }/${ currentGame.id }`}>{ currentGame.scenario }</Link> { currentGame.date }</li>;
    });

    return (
      <div>
        <h1>Dashboard</h1>

        <p><Link to="/new-game">New Game</Link></p>

        <p>Your Stats</p>

        <p>Total Games: {Object.keys(this.state.games).length}</p>

        <h2>Previous Games</h2>
        <ul>
          {games}
        </ul>
      </div>
    );
  }
}

export default Dashboard;