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

      console.log(this.state.games);
      let myGames = this.state.games.sort((a, b) => {
        let aDate = a.date.split('-');
        let aMonth = aDate[0];
        let aDay = aDate[1];
        let aYear = aDate[2];

        let bDate = b.date.split('-');
        let bMonth = bDate[0];
        let bDay = bDate[1];
        let bYear = bDate[2];

        if (aDay > bDay) {
          return a - b;
        }
      });

      previousGames = myGames.map((game, index) => {
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