import React, { Component } from 'react';

class RollDice extends Component {
  state = {
    isOpen: false,
    rolls: {},
  }
  componentWillMount = () => {
    this.store = this.props.store;
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      rolls: Object.assign({}, nextProps.rolls, {}),
    });
  }
  toggleDrawer = (preference) => {

    let newSliderState = !this.state.isOpen;

    if (typeof preference === 'boolean') {
      newSliderState = preference;
    }

    this.setState({
      isOpen: newSliderState,
    });
  }

  rollDice = (number, e) => {
    e.preventDefault(); 

    let rollConfig = {
      id: this.props.gameId,
      number,
      order: this.props.nextOrder
    }

    this.toggleDrawer(false);

    this.store.addDiceRoll(rollConfig, () => null);
  }

  removeLastRoll = (e) => {
    e.preventDefault();
    
    this.toggleDrawer(false)
    let lastRoll = Object.keys(this.state.rolls)[Object.keys(this.state.rolls).length - 1];
    this.store.removeRoll(lastRoll);
  }
  render() {
    return (
      <div className={`fab ${ this.state.isOpen ? 'fab__open' : '' }`} style={{zIndex: 10}}>
        <button className="fab__button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect" onClick={this.toggleDrawer}>Roll</button>
        <div className={`fab__drawer ${ this.state.isOpen ? 'fab__drawer__open' : '' } mdl-card mdl-shadow--2dp`}>
          <div className="mdl-card__title">
            <h2 className="mdl-card__title-text">It is { this.props.currentPlayer }'s turn.</h2>
          </div>
          <div className="mdl-card__actions">
            <form className='fab__drawer__content dice-form mdl-card__actions mdl-card--border'>
              <a name="number-3" value="3" onClick={this.rollDice.bind(this, '2')}>2</a>
              <a name="number-4" value="4" onClick={this.rollDice.bind(this, '3')}>3</a>
              <a name="number-5" value="5" onClick={this.rollDice.bind(this, '4')}>4</a>
              <a name="number-6" value="6" onClick={this.rollDice.bind(this, '5')}>5</a>
              <a name="number-7" value="7" onClick={this.rollDice.bind(this, '6')}>6</a>
              <a name="number-8" value="8" onClick={this.rollDice.bind(this, '7')}>7</a>
              <a name="number-9" value="9" onClick={this.rollDice.bind(this, '8')}>8</a>
              <a name="number-10" value="10" onClick={this.rollDice.bind(this, '9')}>9</a>
              <a name="number-11" value="11" onClick={this.rollDice.bind(this, '10')}>10</a>
              <a name="number-12" value="12" onClick={this.rollDice.bind(this, '11')}>11</a>
              <a name="number-2" value="2" onClick={this.rollDice.bind(this, '12')}>12</a>
              <a name="remove" value="remove" onClick={this.removeLastRoll}>undo last roll</a>
            </form>
          </div>
        </div>
        <div className="fab__shield" onClick={() => this.toggleDrawer(false)} />
      </div>
    );
  }
}

RollDice.propTypes = {
  store: React.PropTypes.object.isRequired,
  gameId: React.PropTypes.string.isRequired,
};

export default RollDice;