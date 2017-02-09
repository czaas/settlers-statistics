import React, { Component } from 'react';

const DiceOne = () => (
  <div className="dice dice--1">
    <div className="dice__row"> 
      <div className="dice__blank"></div>
      <div className="dice__blank"></div>
      <div className="dice__blank"></div>
    </div>
    <div className="dice__row"> 
      <div className="dice__blank"></div>
      <div className="dice__dot"></div>
      <div className="dice__blank"></div>
    </div>
    <div className="dice__row"> 
      <div className="dice__blank"></div>
      <div className="dice__blank"></div>
      <div className="dice__blank"></div>
    </div>
  </div>
);

const DiceTwo = () => (
  <div className="dice dice--2">
    <div className="dice__row"> 
      <div className="dice__dot"></div>
      <div className="dice__blank"></div>
      <div className="dice__blank"></div>
    </div>
    <div className="dice__row"> 
      <div className="dice__blank"></div>
      <div className="dice__blank"></div>
      <div className="dice__blank"></div>
    </div>
    <div className="dice__row"> 
      <div className="dice__blank"></div>
      <div className="dice__blank"></div>
      <div className="dice__dot"></div>
    </div>
  </div>
);

const DiceThree = () => (
  <div className="dice dice--3">
    <div className="dice__row"> 
      <div className="dice__dot"></div>
      <div className="dice__blank"></div>
      <div className="dice__blank"></div>
    </div>
    <div className="dice__row"> 
      <div className="dice__blank"></div>
      <div className="dice__dot"></div>
      <div className="dice__blank"></div>
    </div>
    <div className="dice__row"> 
      <div className="dice__blank"></div>
      <div className="dice__blank"></div>
      <div className="dice__dot"></div>
    </div>
  </div>
);

const DiceFour = () => (
  <div className="dice dice--4">
    <div className="dice__row"> 
      <div className="dice__dot"></div>
      <div className="dice__blank"></div>
      <div className="dice__dot"></div>
    </div>
    <div className="dice__row"> 
      <div className="dice__blank"></div>
      <div className="dice__blank"></div>
      <div className="dice__blank"></div>
    </div>
    <div className="dice__row"> 
      <div className="dice__dot"></div>
      <div className="dice__blank"></div>
      <div className="dice__dot"></div>
    </div>
  </div>
);

const DiceFive = () => (
  <div className="dice dice--5">
    <div className="dice__row"> 
      <div className="dice__dot"></div>
      <div className="dice__blank"></div>
      <div className="dice__dot"></div>
    </div>
    <div className="dice__row"> 
      <div className="dice__blank"></div>
      <div className="dice__dot"></div>
      <div className="dice__blank"></div>
    </div>
    <div className="dice__row"> 
      <div className="dice__dot"></div>
      <div className="dice__blank"></div>
      <div className="dice__dot"></div>
    </div>
  </div>
);

const DiceSix = () => (
  <div className="dice dice--6">
    <div className="dice__row"> 
      <div className="dice__dot"></div>
      <div className="dice__blank"></div>
      <div className="dice__dot"></div>
    </div>
    <div className="dice__row"> 
      <div className="dice__dot"></div>
      <div className="dice__blank"></div>
      <div className="dice__dot"></div>
    </div>
    <div className="dice__row"> 
      <div className="dice__dot"></div>
      <div className="dice__blank"></div>
      <div className="dice__dot"></div>
    </div>
  </div>
);

export default class Dice extends Component {

  getNumber = () => {
    let numbers = [];
    switch (Math.abs(this.props.number)) {
      case 1:
        numbers.push(<DiceOne />);
        break
      case 2:
        numbers.push(<DiceTwo />);
        break
      case 3:
        numbers.push(<DiceThree />);
        break
      case 4:
        numbers.push(<DiceFour />);
        break
      case 5:
        numbers.push(<DiceFive />);
        break
      case 6:
        numbers.push(<DiceSix />);
        break
      default:
      break;
    }

    return numbers;
  }

  render() {
    let numbers;
    if (typeof Math.abs(this.props.number) === 'number') {
      numbers = this.getNumber(this.props.number);
    } else if (Array.isArray(this.props.number)) {
      this.props.number.map((number) => {
        numbers = [...numbers, ...this.getNumber(number)];
      });
    }
    return (
      <div>
        {numbers}
      </div>
    );
  }
}
