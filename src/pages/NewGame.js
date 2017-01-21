import React, { Component } from 'react';
import firebase from 'firebase';

import generateUUID from './../util/uuid';

class NewGame extends Component {
  constructor(props) {
    super(props);

    let date = new Date();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();

    // if the month only has 1 digit, we will append a zero
    let formattedMonth = (month.toString().length === 1) ? '0' + month.toString() : month;
    let today = `${formattedMonth}-${day}-${year}`;

    this.state = {
      scenario: '',
      date: today,
      players: []
    };
  }

  partOne = (e) => {
    e.preventDefault();

    let scenario = this.refs.scenario.value;

    this.refs.scenarioForm.reset();

    this.setState({
      scenario: scenario,
    });
  }

  addPlayer = (e) => {
    e.preventDefault();
    let name = this.refs.playerName.value;
    let color = this.refs.playerColor.value;

    let playerTemplate = {
      name: name,
      order: this.state.players.length + 1,
      color: color,
    };

    this.refs.addPlayerForm.reset();

    this.setState({
      players: [...this.state.players, playerTemplate]
    });
  }

  startGame = (e) => {
    // save game to firebase
    // save game id to users log
    // redirect to games screen
    e.preventDefault();
    
    let gameRef = generateUUID();

    let game = {
      scenario: this.state.scenario,
      players: [...this.state.players],
      date: this.state.date,
      id: gameRef,
      finished: false,
      largestRoad: 'no one',
      largestArmy: 'no one',
      winner: 'no one',
    };



    firebase.database().ref(`games/${ gameRef }`).set(game);

    firebase.database().ref(`users/${ this.props.user.uid }/games/${ gameRef }`).set({
      date: this.state.date,
      id: gameRef,
      scenario: this.state.scenario,
    });

    this.props.router.push(`/play-game/${ gameRef }`);
  }

  render() {

    let players = this.state.players.map((player, index) => {
      return (<li key={'player-' + index}>{player.name} <div className="playerColorBox" style={{ background: player.color }}></div></li>);
    });

    return (
      <div>
        <h1>Starting a New Game</h1>

        <hr />        

        <form ref="scenarioForm" onSubmit={this.partOne}>
          <p>Setup your gameboard for your prefered scenario and enter that scenario name below.</p>
          <input type="text" ref="scenario" placeholder="Scenario name" required="true" />
          <button>Save</button>
        </form>

        <hr />

        <form ref="addPlayerForm" onSubmit={this.addPlayer}>
          <h2>Adding players</h2>
          
          <p>Now have everyone roll the dice. to see who goes first.</p>

          <p>Add player #{this.state.players.length + 1}</p>

          <input type="text" ref="playerName" placeholder="Player Name" />
          <input type="text" ref="playerColor" placeholder="Player Color" />
          <button>Add player</button>
        </form>

        <hr />

        <h2>Game Details</h2>
        <h3>{this.state.scenario}</h3>
        <p><strong>Players</strong></p>

        <ul> 
          {players}
        </ul>

        <p>Once everyone has been entered, continue below to start collecting statistics!</p>
        <a onClick={this.startGame}>Start Game</a>
      </div>
    );
  }
}

export default NewGame;