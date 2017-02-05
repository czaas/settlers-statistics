import React, { Component } from 'react';
import shortid from 'shortid';

import SettlersStore from './_store';

export default class NewGame extends Component {
  state = {
    scenario: '',
    players: [],
    id: '',
  }

  componentWillMount = () => {
    this.store = new SettlersStore();

    this.setState({
      id: shortid.generate(),
    });
  }

  handleScenario = (e) => {
    e.preventDefault();

    this.setState({
      scenario: this.refs.scenario.value,
    });
  }

  handleInvitePlayer = () => {
    let shareLink = `${ window.location.origin }/join-game/${ this.state.id }/${this.state.players.length+1 }`;

    let playerName = this.refs.player.value;

    if (playerName !== '') {
      this.addPlayer();
      alert(`Share this link with ${ playerName } \n${shareLink}`);
    } else {
      alert('Please enter a name');
    }
  }

  addPlayer = () => {
    let playerName = this.refs.player.value;
    if (playerName !== '') {
      let newPlayer = {
        name: playerName,
        order: this.state.players.length + 1,
        id: 'guest',
      };

      this.setState({
        players: [...this.state.players, newPlayer],
      });

      this.refs.playerForm.reset();
    } else {
      alert('Please enter a name');
    }
  }
  removePlayer = (order) => {
    let players = [];
    let newPlayerIndex = 0;

    this.state.players.map((player, i) => {
      if (player.order !== order) {
        newPlayerIndex++;

        player.order = newPlayerIndex;
        players.push(player);
      }

      return player;
    });

    this.setState({
      players: [...players],
    });
  }

  startGame = () => {
    let newGame = {
      scenario: this.state.scenario,
      players: this.state.players,
    };
    this.store.startNewGame(newGame, (newGameId) => {
      this.props.push(`/dashboard/play/${ newGameId }`);
    });
  }

  render() {
    let players = this.state.players.map((player, index) => {
      let icon = (player && player.icon) ? player.icon : 'https://placeholdit.imgix.net/~text?txtsize=33&txt=User%20Icon&w=150&h=150';
      return (
        <li key={'player-' + index}>{ player.name } <span onClick={this.removePlayer.bind(this, player.order)}>remove</span> <img src={ icon } role="presentation" /></li>
      );
    });
    return (
      <div>
        <header>
          <h1>New Game</h1>
        </header>
        <main>
          <div className="card">
            <form onSubmit={this.handleScenario}>
              <h2>Add Scenario Name</h2>
              <p><strong>Name: </strong> { this.state.scenario }</p>
              <input type="text" ref="scenario" placeholder="Scenario name" required="true" />
              <button>Save</button>
            </form>
          </div>

          <div className="card">
            <p>If someone is playing and not keeping track of their stats, use Add Guest. </p>
            <form ref="playerForm" onSubmit={(e) => e.preventDefault()}>
              <input type="text" ref="player" placeholder="Players name" required="true" />
            </form>
            <button onClick={this.addPlayer}>Add Guest</button> <button onClick={this.handleInvitePlayer}>Invite Player</button>
            <ul>
              {players}
            </ul>
          </div>

          <div className="card">
            <h2>Confirm Game Details</h2>
            <p>Confirm your scenario name and players. There will be no changing these after this point.</p>
            <button onClick={this.startGame}>Start Game</button>
          </div>
        </main>
      </div>
    );
  }
}
