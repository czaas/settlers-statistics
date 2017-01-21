import React, { Component } from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';

class ViewGames extends Component {

  constructor() {
    super();

    this.state = {
      receivedData: false,
      games: [],
    }

  }
  componentWillMount = () => {
    if (this.props.userLoggedIn) {
      this.userReference = firebase.database().ref(`users/${ this.props.user.uid }/games/`);
      this.userReference.once('value', (snapshot) => {

        let games = [];

        if (typeof snapshot.val() === 'object') {
          for(let key in snapshot.val()) {
            games.push(snapshot.val()[key]);
          }
        }

        this.setState({
          receivedData: true,
          games: [...this.state.games, ...games],
        });
      });

    } else {
      console.error('user not logged in');
    }
  }

  render() {
    let previousGames = [];

    if (this.state.receivedData) {
      previousGames = this.state.games.map((game, index) => {
        let link;
        let finsihedMessage = (game.finished) ? '(finished)' : null;

        if (game.finished) {
          link = `/view-game/${game.id}`;
        } else {
          link = `/play-game/${game.id}`;
        }
        return (
          <div key={`previous-game-${index}`}>
            <p><Link to={link}>{game.scenario} {finsihedMessage}<strong>{game.date}</strong></Link></p>
          </div>
        );
      })
    }
    return (
      <div>
        {previousGames}
      </div>
    );
  }
}

export default ViewGames;