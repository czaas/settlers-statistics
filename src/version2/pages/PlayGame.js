import React, { Component } from 'react';

import SettlersStore from './_store';
import DiceRolled from './shared/DiceRolled';

import RollDice from './shared/RollDice';

export default class PlayGame extends Component {
  state = {
    haveReceivedData: false,
    game: {
      rolls: {},
    },
    images: [],
  }

  componentWillMount = () => {
    this.store = new SettlersStore(this.props.match.params.id);

    this.store.getImageUrls(this.props.match.params.id, (images) => {
      this.setState({
        images: images,
      });
    });

    this.store.subscribeToGame(this.props.match.params.id, (val) => {
      let gameSettings = Object.assign({}, {
        rolls: {},
      }, val);

      this.setState({
        haveReceivedData: true,
        game: gameSettings, 
      });
    });
  }

  render() {
    let lrSelected = 'no one';
    let laSelected = 'no one';

    let theImages = this.state.images.map((url, index) => {
      return <img src={url} role="presentation" key={`image-${ index }`} />
    });

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
      }
    }

    // console.log(this.state);
    // console.log(this.state.game.rolls) 

    let currentAmountOfRolls = (this.state.game.rolls) ? Object.keys(this.state.game.rolls).length : 0;
    return (
      <div>
        <h2>Dice rolled</h2>
        
        <DiceRolled rolls={this.state.game.rolls} />

        <p><strong>Longest Road</strong> was held by {lrSelected}</p>

        <p><strong>Longest Army</strong> was held by {laSelected}</p>    

        <h2>Images</h2>
        <div>
          {theImages}
        </div>

        <RollDice gameId={this.props.match.params.id} nextOrder={currentAmountOfRolls++} store={this.store} rolls={this.state.game.rolls} />
      </div>
    );
  }
}

