import React, { Component } from 'react';
import firebase from 'firebase';

import DiceRolled from './shared/DiceRolled';
import GetImages from './shared/GetImages';

class PlayGame extends Component {
  constructor() {
    super();

    this.gameReference = undefined;
    this.state = {
      haveReceivedData: false,
      game: {}
    };
  }

  componentDidMount = () => {  
    this.gameReference = firebase.database().ref(`games/${ this.props.params.id }`);
    this.gameReference.on('value', (snapshot) => {
      this.setState({
        haveReceivedData: true,
        game: snapshot.val(),
      });
    });
  }

  rollDice = (number, e) => {
    e.preventDefault(); 
    if (this.state.haveReceivedData) {
      let orderOfRoll = (this.state.game.rolls) ? Object.keys(this.state.game.rolls).length + 1 : 1;

      firebase.database().ref(`games/${ this.props.params.id }/rolls`).push({
        number: number,
        order: orderOfRoll,
      });
    }
  }

  removeLastRoll = (e) => {
    e.preventDefault();

    if (this.state.haveReceivedData && this.state.game.rolls) {
      // getting the key value of last item in rolls object
      let lastRoll = Object.keys(this.state.game.rolls)[Object.keys(this.state.game.rolls).length - 1];

      firebase.database().ref(`games/${ this.props.params.id }/rolls/${ lastRoll }`).remove();
    }
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

  selectWinner = () => {
    let confirmation = confirm('Once you select your winner this game will be locked in history. There is no undo.');

    if (confirmation) {
      firebase.database().ref(`games/${ this.props.params.id }`).update({
        finished: true,
        winner: this.refs.winner.value,
      });
      firebase.database().ref(`users/${ this.props.user.uid }/games/${ this.props.params.id }`).update({
        finished: true,
      });
    }

    alert('Game is over, redirecting...');

    this.props.router.push({
      pathname: `/view-game/${ this.state.game.id }`
    });
  }

  handleImageUpload = (e) => {
    e.stopPropagation();
    e.preventDefault();

    let hasImages = (this.state.game.images) ? Math.abs(this.state.game.images) + 1 : 1;

    if (hasImages <= 3) {
      let images = document.querySelector('input[type=file]').files[0];
      let newImageRef = firebase.storage().ref(`games/${ this.props.params.id }/${ hasImages }.jpg`);

      var reader = new FileReader();

      reader.addEventListener('load', () => {
        var baseLength = 'data:image/jpeg;base64,'.length;

        let image = reader.result.slice(baseLength, reader.result.length);

        newImageRef.putString(reader.result, 'data_url').then((snapshot) => {
          console.log('image uploaded');
          this.refs.imageUploader.value = '';
          
          this.gameReference.update({
            images: hasImages,
          });
        });
      }, false);

      if (images) {
        reader.readAsDataURL(images);
      }
    } else {
      alert('you can not upload more than 3 images per game.');
    }
  }

  render() {
    let playersSelectableOptions = [];
    let playersTurn;
    let nextTurnNumber;
    let lrSelected = 'no one';
    let laSelected = 'no one';
    let winner = 'no one';

    if (this.state.haveReceivedData) {
      const players = this.state.game.players;

      nextTurnNumber = (this.state.game.rolls) ? Object.keys(this.state.game.rolls).length : 0;

      // getting players turn
      let remainderOfPlayers = nextTurnNumber % players.length;
      let playerIndex = remainderOfPlayers / 1; 

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

        if (this.state.game.winner === player.name) {
          winner = player.name;
        }

        playersSelectableOptions.push(<option key={`player-option-${i}`} value={player.name}>{player.name}</option>);
      }
    }

    return (
      <div>
        <h2>{this.state.game.scenario}</h2>
        <p>It is {playersTurn}'s turn. Select the dice you've rolled.</p>
        <p>Current Turn number: {(nextTurnNumber + 1)}</p>
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

        <form>
          <input type="file" accept="image/*;capture=camera" ref='imageUploader' onChange={this.handleImageUpload} />
        </form>

        <GetImages id={this.props.params.id} amountOfImages={this.state.game.images || 0} />

        <form>
          Winner
          <select ref="winner" value={winner} onChange={this.selectWinner}>
            <option value={'no one'}>no one</option>
            {playersSelectableOptions}
          </select>
        </form>
      </div>
    );
  }
}


export default PlayGame;