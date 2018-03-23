import React from 'react';
import {NumberTextField} from '@pie-lib/config-ui'

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.handleNumberFieldChange = this.handleNumberFieldChange.bind(this);
  }

  handleNumberFieldChange(change) {
    console.log("CHANGE", change);
  }

  render() {
    return (
      <div>
      Box Width
      <NumberTextField 
        value={100}
        min={1}
        max={3}
        onChange={this.handleNumberFieldChange}
        
      />
      column
      <br />
      Box Height
      <NumberTextField 
        value={100}
        min={1}
        max={10}
        onChange={this.handleNumberFieldChange}
        label="Hello"
      />
      rows
      </div>
    );
  }
}