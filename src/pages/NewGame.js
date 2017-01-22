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
      players: [],
      partActive: 1,
    };
  }

  saveScenarioName = (e) => {
    e.preventDefault();

    let scenario = this.refs.scenario.value;

    this.refs.scenarioForm.reset();

    this.setState({
      scenario: scenario,
    });
    this.setActivePartOfForm(2);
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

  undoLastPlayer = (e) => {
    e.preventDefault();

    let newListOfPlayers = [];

    for (let i = 0; i < this.state.players.length; i++) {
      if (this.state.players[i].order !== this.state.players.length) {
        newListOfPlayers.push(this.state.players[i]);
      }
    }

    this.setState({
      players: [...newListOfPlayers],
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

  setActivePartOfForm = (part) => {
    this.setState({
      partActive: part
    });
  }

  render() {

    let players = this.state.players.map((player, index) => {
      return (<li key={'player-' + index}>{player.name} <div className="playerColorBox" style={{ background: player.color }}></div></li>);
    });

    return (
      <div className="page new-game">
        <h1>Start a New Game</h1>

        <ol className={`step step--${this.state.partActive}`}>
          <li className="step__1" onClick={this.setActivePartOfForm.bind(this, 1)}>Set Scenario</li>
          <li className="step__2" onClick={this.setActivePartOfForm.bind(this, 2)}>Add Players</li>
          <li className="step__3" onClick={this.setActivePartOfForm.bind(this, 3)}>Confirm Details</li>
        </ol>

        <div className={`new-game__section-wrapper current-${this.state.partActive}`}>
          <div className="new-game__section new-game__section--1">
            <form ref="scenarioForm" onSubmit={this.saveScenarioName}>
              <h2>Add Scenario Name</h2>
              <p>Setup your gameboard for your prefered scenario and enter that scenario name below.</p>
              <input type="text" ref="scenario" placeholder="Scenario name" required="true" />
              <button>Next</button>
            </form>
          </div>
          
          <div className="new-game__section new-game__section--2">
            <form ref="addPlayerForm" onSubmit={this.addPlayer}>
              <h2>Adding players</h2>
              
              <p>Now have everyone roll the dice. to see who goes first.</p>

              <p>Add player #{this.state.players.length + 1}</p>

              <input type="text" ref="playerName" placeholder="Player Name" />
              <input type="text" ref="playerColor" placeholder="Player Color" />
              <button>Add player</button>
            </form>

            <button onClick={this.undoLastPlayer}>Undo last player</button>

            <ul> 
              {players}
            </ul>

            <button onClick={this.setActivePartOfForm.bind(this, 3)}>Review and Confirm Game Details</button>
          </div>

          <div className="new-game__section new-game__section--3">
            <h2>Confirm Game Details</h2>
            <p>Confirm your scenario name and players. There will be no changing these after this point.</p>

            <p>Scenario Name <strong>{this.state.scenario}</strong></p>

            <p><strong>Players</strong></p>

            <ul> 
              {players}
            </ul>

            <button onClick={this.startGame}>Start Game</button>
          </div>
        </div>
      </div>
    );
  }
}

export default NewGame;