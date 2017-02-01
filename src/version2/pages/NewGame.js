import React, { Component } from 'react';

import SettlersStore from './_store';

export default class NewGame extends Component {
  state = {
    scenario: '',
  }

  componentWillMount = () => {
    this.store = new SettlersStore();
  }

  handleScenario = (e) => {
    e.preventDefault();

    this.setState({
      scenario: this.refs.scenario.value,
    });
  }

  render() {
    return (
      <div>
        <h1>Start New Game</h1>
        <div className="card">
          <form onSubmit={this.handleScenario}>
            <h2>Add Scenario Name</h2>
            <p><strong>Name: </strong> { this.state.scenario }</p>
            <input type="text" ref="scenario" placeholder="Scenario name" required="true" />
            <button>Save</button>
          </form>
        </div>
      </div>
    );
  }
}
