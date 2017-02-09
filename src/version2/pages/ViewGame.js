import React, { Component } from 'react';

import SettlersStore from './_store';

import DiceRolled from './components/DiceRolled';

export default class ViewGame extends Component {
  state = {
    haveReceivedData: false,
    game: {},
    images: [],
  }

  componentWillMount = () => {
    this.store = new SettlersStore();

    this.store.getImageUrls(this.props.match.params.id, (images) => {
      this.setState({
        images: images,
      });
    });

    this.store.getGame(this.props.match.params.id, (val) => {
      this.setState({
        haveReceivedData: true,
        game: val,
      });
    });
  }

  render() {
    let lrSelected = 'no one';
    let laSelected = 'no one';
    let winner = 'no one';

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

        if (this.state.game.winner === player.name) {
          winner = player.name;
        }
      }
    }
    return (
      <div>
        <header>
          <h1>{this.state.game.scenario}</h1>

          <p><strong>Game is over</strong></p>
        </header>
        <main>
          <p><strong>Winner</strong> {winner}</p>
          
          <p><strong>Longest Road</strong> was held by {lrSelected}</p>

          <p><strong>Longest Army</strong> was held by {laSelected}</p>    

          <h2>Dice rolled</h2>

          <DiceRolled rolls={this.state.game.rolls} />

          <h2>Images</h2>
          <div>
            {theImages}
          </div>
        </main>
      </div>
    );
  }
}
