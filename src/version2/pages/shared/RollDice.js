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
  toggleSlider(preference) {

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

    this.store.addDiceRoll(rollConfig, () => {
      this.toggleSlider(false);
    });
  }

  removeLastRoll = (e) => {
    e.preventDefault();

    // console.log(this.state.rolls);

    let lastRoll = Object.keys(this.state.rolls)[Object.keys(this.state.rolls).length - 1];
    // console.log(lastRoll)
    this.store.removeRoll(lastRoll);
  }
  render() {

    return (
      <div className="fab">
        <button className="fab__button">Show Dice form FAB</button>
        <div className="fab__drawer">
          <form className='fab__drawer__content dice-form'>
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
    );
  }
}

RollDice.propTypes = {
  store: React.PropTypes.object.isRequired,
  gameId: React.PropTypes.string.isRequired,
};

export default RollDice;