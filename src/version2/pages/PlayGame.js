import React, { Component } from 'react';

import SettlersStore from './_store';
import DiceRolled from './components/DiceRolled';

import RollDice from './components/RollDice';

export default class PlayGame extends Component {
  state = {
    haveReceivedData: false,
    game: {
      rolls: {},
    },
    images: [],
    winnerSelected: false,
  }

  componentDidMount() {
    for (var key in this.refs) {
      if (this.refs[key]) {
        window.componentHandler.upgradeElement(this.refs[key]);
      }
    }
  }

  componentWillMount = () => {
    this.store = new SettlersStore(this.props.match.params.id);

    this.getImages();
    this.store.subscribeToGame(this.props.match.params.id, (val) => {
      let gameSettings = Object.assign({}, {
        rolls: {},
      }, val);

      if (gameSettings.finished) {
        this.props.push(`/dashboard/game/${ gameSettings.id }`);
      }

      this.setState({
        haveReceivedData: true,
        game: gameSettings, 
      });
    });
  }

  getImages = () => {
    this.store.getImageUrls(this.props.match.params.id, (images) => {
      this.setState({
        images: images,
      });

      // console.log(images)
    });
  }

  selectLargestArmy = (person) => {

    this.refs.largestArmyButton.click();
    this.store.updateLargestArmy(person, () => {
      // console.log('largest army updated');
    });
  }
  selectLongestRoad = (person) => {
    this.refs.longestRoadButton.click();
    this.store.updateLongestRoad(person, () => {
      // console.log('longest road updated');
    });
  }

  selectWinner = (person) => {
    this.refs.winnerButton.click();

    this.setState({
      winnerSelected: person,
    })
  }

  handleImageUpload = (e) => {
    e.stopPropagation();
    e.preventDefault();

    this.setState({
      showImageUploadSpinner: true,
    });

    let amountOfImages = (this.state.game.images) ? Math.abs(this.state.game.images) + 1 : 1;


    let gameId = this.props.match.params.id;

    if (amountOfImages <= 3) {
      let images = document.getElementById('image-uploader').files[0];
      var reader = new FileReader();

      reader.addEventListener('load', () => {
        var baseLength = 'data:image/jpeg;base64,'.length;

        let newImageRef = this.store.handleImageUpload({
          id: gameId, 
          number: amountOfImages,
        });

        newImageRef.putString(reader.result, 'data_url').then((snapshot) => {
          console.log('image uploaded');
          this.refs.imageUploader.value = '';
          console.log(snapshot);

          let imageDownloadUrl = snapshot.a.downloadURLs[0];

          this.store.updateGame({
            images: amountOfImages,
          });

          this.setState({
            showImageUploadSpinner: false,
            images: [...this.state.images, imageDownloadUrl],
          });

          this.getImages();
        });
      }, false);

      if (images) {
        reader.readAsDataURL(images);
      }
    }
  }

  uploadImage = () => {
    this.refs.imageUploader.click();
  }

  endGame = () => {
    console.log('end game', this.state);

    this.store.endGame({
      winner: this.state.winnerSelected,
      id: this.props.match.params.id,
    });
  }

  render() {

    let lrSelected = 'no one';
    let laSelected = 'no one';
    let players = [];
    let currentAmountOfRolls = (this.state.game.rolls) ? Object.keys(this.state.game.rolls).length : 0;
    let currentPlayer = '';

    let playersSelect = () => null;

    let theImages = this.state.images.map((url, index) => {
      return <img src={url} role="presentation" key={`image-${ index }`} />
    });

    if (this.state.haveReceivedData) {
      // getting largest army player     
      playersSelect = (selectionName, onClickListener) => this.state.game.players.map((player, playerSelectIndex) => {
        return (
          <li key={`players-select-${selectionName}-${ playerSelectIndex }`} onClick={onClickListener.bind(this, player.name)} className="mdl-menu__item">
            {player.name}  
          </li>
        );
      });

      for (let i = 0; i < this.state.game.players.length; i++) {
        let player = this.state.game.players[i];

        players.push(player);

        // getting longest road player
        if (this.state.game.longestRoad === player.name) {
          lrSelected = player.name;
        }


        if (this.state.game.largestArmy === player.name) {
          laSelected = player.name;
        }
      }

      // getting next players turn
      let nextTurnNumber = (this.state.game.rolls) ? Object.keys(this.state.game.rolls).length : 0;
      let remainderOfPlayers = nextTurnNumber % (this.state.game.players.length);

      currentPlayer = this.state.game.players[remainderOfPlayers];
    }
    return (
      <div>
        <header>
          <h1>Playing {this.state.game.scenario}</h1>
        </header>
        <main>
        <div className="mdl-card mdl-shadow--2dp">
          <div className="mdl-card__title">
            <h2 className="mdl-card__title-text">Dice Rolled</h2>
          </div>
          <div className="mdl-card__supporting-text">
            <p>Amount of dice rolled this game {this.state.game.rolls.length}</p>
          </div>
          <div className="mdl-card__actions mdl-card--border">
            <DiceRolled rolls={this.state.game.rolls} />
          </div>
        </div>
          

          <div className="mdl-card mdl-shadow--2dp">
            <div className="mdl-card__title">
              <h2 className="mdl-card__title-text">Longest Road</h2>
            </div>
            <div className="mdl-card__supporting-text">
              <p>The longest road is travelled by {lrSelected}</p>
            </div>
            <div className="mdl-card__actions mdl-card--border">
              <button className="mdl-button mdl-js-button mdl-js-ripple-effect" id="longestRoad" ref="longestRoadButton">{lrSelected} <i className="material-icons">arrow_drop_down</i></button>

              <ul className="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect" ref="largestRoadList" htmlFor="longestRoad">
                {playersSelect('longest-road', this.selectLongestRoad)}
              </ul>
            </div>
          </div>

          <div className="mdl-card mdl-shadow--2dp">
            <div className="mdl-card__title">
              <h2 className="mdl-card__title-text">Largest Army</h2>
            </div>
            <div className="mdl-card__supporting-text">
              <p>The largest army is owned by {laSelected}</p>
            </div>
            <div className="mdl-card__actions mdl-card--border">
              <button className="mdl-button mdl-js-button mdl-js-ripple-effect" id="largestArmy" ref="largestArmyButton">{laSelected} <i className="material-icons">arrow_drop_down</i></button>

              <ul className="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect" ref="largestArmyList" htmlFor="largestArmy">
                {playersSelect('largest-army', this.selectLargestArmy)}
              </ul>
            </div>
          </div>

          <div className="mdl-card image-uploader mdl-shadow--2dp">
            <div className="mdl-card__title">
              <h2 className="mdl-card__title-text">Upload and view photos</h2>

              {theImages}
            </div>
            <div className="mdl-card__supporting-text">
              <p>You can upload up to 3 images per game</p>
            </div>
            <div className="mdl-card__actions mdl-card--border">
              <input type="file" hidden accept="image/*;capture=camera" ref='imageUploader' onChange={this.handleImageUpload} id="image-uploader" />
              <button onClick={this.uploadImage} className="image-button mdl-button mdl-button--raised mdl-js-button mdl-js-ripple-effect">
                <i className="material-icons">photo_camera</i><br />
                Upload Image
              </button>
            </div>
          </div>

          <div className="mdl-card image-uploader mdl-shadow--2dp">
            <div className="mdl-card__title">
              <h2 className="mdl-card__title-text">Ending the Game</h2>
            </div>
            <div className="mdl-card__supporting-text">
              <p>Once you end the game there is no undo.</p>
              <p>Enter final results and upload up to 3 images.</p>
            </div>
            <div className="mdl-card__actions mdl-card--border">
              <button className="mdl-button mdl-js-button mdl-js-ripple-effect" id="winnerButton" ref="winnerButton">{this.state.winnerSelected || 'Select Winner'} <i className="material-icons">arrow_drop_down</i></button>
              <ul className="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect" ref="winner" htmlFor="winnerButton">
                {playersSelect('winner', this.selectWinner)}
              </ul>
              <div style={{ display: (this.state.winnerSelected) ? 'block' : 'none' }}>
                <p>There is no undo after this.</p>
                <p>
                  <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect is-disabled" htmlFor="checkbox-2" ref="confirmingNoUndo__label">
                    <input type="checkbox" id="checkbox-2" value="ready" className="mdl-checkbox__input" ref="readyToEndGame" onChange={() => {
                      this.setState({
                        readyToEndGame: this.refs.readyToEndGame.checked,
                      })
                    }} />
                    <span className="mdl-checkbox__label">I Understand</span>
                  </label>
                </p>
                <button onClick={this.endGame} disabled={!this.state.readyToEndGame} className="image-button mdl-button mdl-button--raised mdl-js-button mdl-js-ripple-effect">End Game</button>
              </div>
            </div>
          </div>

          <RollDice gameId={this.props.match.params.id} nextOrder={currentAmountOfRolls++} store={this.store} rolls={this.state.game.rolls} currentPlayer={currentPlayer.name} />
        </main>
      </div>
    );
  }
}

