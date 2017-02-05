import firebase from 'firebase';
import shortid from 'shortid';

class SettlersStore {
  constructor(currentGameId) {
    this.db = firebase.database();

    this.currentUser = firebase.auth().currentUser;
    this.currentGameRef = undefined;

    if (currentGameId) {
      this.currentGameRef = this.db.ref(`games/${ currentGameId }`);
    }
  }
  getGameList(cb) {
    this.db.ref(`users/${ this.currentUser.uid }/games`).once('value', (snapshot) => {
      return cb(snapshot.val());
    });
  }

  getGame(id, cb) {
    this.db.ref(`games/${ id }`).once('value').then((snapshot) => {
      cb(snapshot.val());
    });
  }

  subscribeToGame(id, cb) {
    this.db.ref(`games/${ id }`).on('value', (snapshot) => {
      cb(snapshot.val());
    });
  }

  startNewGame(newGameSettings, cb) {
    // let gameSaved = false;
    // let userGameSaved = false;

    let date = new Date();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();

    // if the month only has 1 digit, we will append a zero
    let formattedMonth = (month.toString().length === 1) ? '0' + month.toString() : month;
    let today = `${formattedMonth}-${day}-${year}`;

    let gameRef = shortid.generate();
    let gameDetails = Object.assign({}, {
      scenario: '',
      players: [],
      date: today,
      id: gameRef,
      finished: false,
      longestRoad: 'no one',
      largestArmy: 'no one',
      winner: 'no one',
      host: this.currentUser.uid,
    }, newGameSettings);


    // adding game
    this.currentGameRef = this.db.ref(`games/${ gameRef }`);
    this.currentGameRef.set(gameDetails);

    // Save game to users reference
    this.db.ref(`users/${ this.currentUser.uid }/games/${ gameRef }`).set({
      date: today,
      id: gameRef,
      scenario: gameDetails.scenario,
    }).then(() => cb(gameRef));
  }

  addDiceRoll(settings, cb) {
    this.currentGameRef.child(`rolls`).push({
      number: settings.number,
      order: settings.order
    }).then((res) => {
      cb();
    });
  }

  removeRoll(currentDiceRoll, cb) {
    if (currentDiceRoll) {
      this.currentGameRef.child(`rolls/${ currentDiceRoll }`).remove();
    }
  }

  saveGameRefToUser(gameDetails) {
    let details = Object.assign({}, {
      id: -1,
      playerOrder: -1,
    }, gameDetails);

    if (details.id !== -1 && details.playerOrder !== -1) {
      this.db.ref(`users/${ this.currentUser.id }/games/${ details.id }`).set({
        date: gameDetails.date,
        id: details.id,
        scenarioName: details.scenarioName
      }).then(() => {
        
      });
    }
  }

  getImageUrls(gameId, cb) {
    let images = [];

    this.getGame(gameId, (data) => {
      if (data.images !== undefined) {
        for (var i = 0; i < data.images; i ++) {
          let imageRef = firebase.storage().ref(`games/${ gameId }/${ i + 1 }.jpg`);
          imageRef.getDownloadURL().then((url) => {
            images.push(url);
          }).then(() => cb(images));
        }
      } else {
        cb(images);
      }
    });
  }

  updateLargestArmy(newName, cb) {
    if (newName !== '') {
      this.currentGameRef.update({
        largestArmy: newName,
      }).then(cb);
    }
  }

  updateLongestRoad(newName, cb) {
    if (newName !== '') {
      this.currentGameRef.update({
        longestRoad: newName,
      }).then(cb);
    }
  }
}

export default SettlersStore;