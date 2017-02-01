import React from 'react';

class DiceRolled extends React.Component {
  render() {
    let twos = 0;
    let threes = 0;
    let fours = 0;
    let fives = 0;
    let sixes = 0;
    let sevens = 0;
    let eights = 0;
    let nines = 0;
    let tens = 0;
    let elevens = 0;
    let twelves = 0;

    for (var key in this.props.rolls) {
      switch(this.props.rolls[key].number) {
        case '2':
          twos++;
          break;
        case '3':
          threes++;
          break;
        case '4':
          fours++;
          break;
        case '5':
          fives++;
          break;
        case '6':
          sixes++;
          break;
        case '7':
          sevens++;
          break;
        case '8':
          eights++;
          break;
        case '9':
          nines++;
          break;
        case '10':
          tens++;
          break;
        case '11':
          elevens++;
          break;
        case '12':
          twelves++;
          break;
        default:
          break;
      }
    }
    return (
      <table className="dice-rolled-table">
        <tbody>
          <tr>
            <th>Dice #</th>
            <th>2</th>
            <th>3</th>
            <th>4</th>
            <th>5</th>
            <th>6</th>
            <th>7</th>
            <th>8</th>
            <th>9</th>
            <th>10</th>
            <th>11</th>
            <th>12</th>
          </tr>
          <tr>
            <td>Qty rolled</td>
            <td>{twos}</td>
            <td>{threes}</td>
            <td>{fours}</td>
            <td>{fives}</td>
            <td>{sixes}</td>
            <td>{sevens}</td>
            <td>{eights}</td>
            <td>{nines}</td>
            <td>{tens}</td>
            <td>{elevens}</td>
            <td>{twelves}</td>
          </tr>
        </tbody>
      </table>
    )
  }
}

export default DiceRolled;