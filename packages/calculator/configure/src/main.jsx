import React from 'react';
import ReactDOM from 'react-dom';
import Calculator from '@pie-framework/material-ui-calculator';
import { InputRadio, TwoChoice } from '@pie-lib/config-ui';

export default class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      twoChoice: '',
      model: props.model
    };
  }

  render() {
    const { basic, scientific } = this.state;
    return (
      <div>
        <TwoChoice
          header="Choose Calculator Type"
          value={this.state.twoChoice}
          onChange={twoChoice => this.setState({ twoChoice })}
          one={{ label: 'Basic', value: 'basic' }}
          two={{ label: 'Scientific', value: 'scientific' }} />
          {this.state.twoChoice && <Calculator mode={this.state.twoChoice} />}
      </div>
    );
  }
}