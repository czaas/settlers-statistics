import React, { Component } from 'react';
import firebase from 'firebase';

class PlayGame extends Component {
  constructor() {
    super();

    this.gameReference = undefined;

    this.state = {
      haveReceivedData: false,
      game: {}
    };
  }

  componentWillMount = () => {  
    this.gameReference = firebase.database().ref(`games/${ this.props.params.id }`);
    this.gameReference.on('value', (snapshot) => {
      this.setState({
        haveReceivedData: true,
        game: snapshot.val(),
      })
    });
  }

  rollDice = (number, e) => {
    e.preventDefault();

    firebase.database().ref(`games/${ this.props.params.id }/rolls`).push(number);
  }

  removeLastRoll = () => {
    // firebase.database().ref();
  }

  setLongestRoad = (e) => {
    e.preventDefault();
    firebase.database().ref(`games/${ this.props.params.id }`).update({
      longestRoad: this.refs.longestRoad.value,
    });
  }

  setLargestArmy = (e) => {
    firebase.database().ref(`games/${ this.props.params.id }`).update({
      largestArmy: this.refs.largestArmy.value,
    });
  }

  render() {
    console.log(this.state);
    let playersSelectableOptions = [];
    let playersTurn;
    let nextTurnNumber;
    let lrSelected = 'no one';
    let laSelected = 'no one';

    if (this.state.haveReceivedData) {
      const players = this.state.game.players;

      nextTurnNumber = (this.state.game.rolls) ? Object.keys(this.state.game.rolls).length : 0;

      // getting players turn
      let remainderOfPlayers = nextTurnNumber % players.length;
      let playerIndex = remainderOfPlayers / 1; 

      console.log(nextTurnNumber);
      console.log(players.length);

      playersTurn = players[playerIndex].name;

      for (let i = 0; i < players.length; i++) {
        let player = players[i];

        // getting longest road player
        if (this.state.game.longestRoad === player.name) {
          lrSelected = player.name;
        }

        // getting largest army player
        if (this.state.game.largestArmy === player.name) {
          laSelected = player.name;
        }

        playersSelectableOptions.push(<option key={`player-option-${i}`} value={player.name}>{player.name}</option>);
      }
    }

    return (
      <div>
        <p>It is {playersTurn}'s turn. Select the dice you've rolled.</p>
        <p>Next Turn number: {(nextTurnNumber + 1)}</p>
        <form>
          <h2>Dice roll</h2>
          <button name="number-3" value="3" onClick={this.rollDice.bind(this, '2')}>2</button>
          <button name="number-4" value="4" onClick={this.rollDice.bind(this, '3')}>3</button>
          <button name="number-5" value="5" onClick={this.rollDice.bind(this, '4')}>4</button>
          <button name="number-6" value="6" onClick={this.rollDice.bind(this, '5')}>5</button>
          <button name="number-7" value="7" onClick={this.rollDice.bind(this, '6')}>6</button>
          <button name="number-8" value="8" onClick={this.rollDice.bind(this, '7')}>7</button>
          <button name="number-9" value="9" onClick={this.rollDice.bind(this, '8')}>8</button>
          <button name="number-10" value="10" onClick={this.rollDice.bind(this, '9')}>9</button>
          <button name="number-11" value="11" onClick={this.rollDice.bind(this, '10')}>10</button>
          <button name="number-12" value="12" onClick={this.rollDice.bind(this, '11')}>11</button>
          <button name="number-2" value="2" onClick={this.rollDice.bind(this, '12')}>12</button>
          <button name="remove" value="remove" onClick={this.removeLastRoll}>undo last roll</button>
        </form>
        <DiceRolled rolls={this.state.game.rolls} />

        <form>
          Longest Road held by
          <select ref="longestRoad" value={lrSelected} onChange={this.setLongestRoad}>
            <option value={'no one'}>no one</option>
            {playersSelectableOptions}
          </select>
        </form>

        <form>
          Longest Army held by
          <select ref="largestArmy" value={laSelected} onChange={this.setLargestArmy}>
            <option value={'no one'}>no one</option>
            {playersSelectableOptions}
          </select>
        </form>        
      </div>
    );
  }
}

class DiceRolled extends React.Component {
  render() {
    let twos = 0;
    let threes = 0;
    let fours = 0;
    let fives = 0;
    let sixes = 0;
    let sevens = 0;
    let eights = 0;
    let nines = 0;
    let tens = 0;
    let elevens = 0;
    let twelves = 0;

    for (var key in this.props.rolls) {
      console.log()
      switch(this.props.rolls[key]) {
        case '2':
          twos++;
          break;
        case '3':
          threes++;
          break;
        case '4':
          fours++;
          break;
        case '5':
          fives++;
          break;
        case '6':
          sixes++;
          break;
        case '7':
          sevens++;
          break;
        case '8':
          eights++;
          break;
        case '9':
          nines++;
          break;
        case '10':
          tens++;
          break;
        case '11':
          elevens++;
          break;
        case '12':
          twelves++;
          break;
        default:
          break;
      }
    }
    return (
      <table>
        <tbody>
          <tr>
            <th>2</th>
            <th>3</th>
            <th>4</th>
            <th>5</th>
            <th>6</th>
            <th>7</th>
            <th>8</th>
            <th>9</th>
            <th>10</th>
            <th>11</th>
            <th>12</th>
          </tr>
          <tr>
            <td>{twos}</td>
            <td>{threes}</td>
            <td>{fours}</td>
            <td>{fives}</td>
            <td>{sixes}</td>
            <td>{sevens}</td>
            <td>{eights}</td>
            <td>{nines}</td>
            <td>{tens}</td>
            <td>{elevens}</td>
            <td>{twelves}</td>
          </tr>
        </tbody>
      </table>
    )
  }
}

export default PlayGame;