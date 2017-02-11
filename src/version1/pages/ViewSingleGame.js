import React, { Component } from 'react';
import firebase from 'firebase';

import DiceRolled from './shared/DiceRolled';
import GetImages from './shared/GetImages';

class ViewSingleGame extends Component {
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

  render() {
    let lrSelected = 'no one';
    let laSelected = 'no one';
    let winner = 'no one';

    if (this.state.haveReceivedData) {
      const players = this.state.game.players;

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
      }
    }

    return (
      <div>
        <p><strong>Winner</strong> {winner}</p>
        
        <p><strong>Longest Road</strong> was held by {lrSelected}</p>

        <p><strong>Longest Army</strong> was held by {laSelected}</p>    

        <h2>Dice rolled</h2>

        <DiceRolled rolls={this.state.game.rolls} />

        <GetImages id={this.props.params.id} amountOfImages={this.state.game.images || 0} />
      </div>
    );
  }
}


export default ViewSingleGame;