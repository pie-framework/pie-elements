import React from 'react';
import {NumberTextField} from '@pie-lib/config-ui'
import PropTypes from 'prop-types';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    
    this.handleWidthChange = this.handleWidthChange.bind(this);
    this.handleHeightChange = this.handleHeightChange.bind(this);
  }

  handleWidthChange(event) {
    this.props.handleWidthChange(parseInt(event.target.value));
  }

  handleHeightChange(event) {
    this.props.handleHeightChange(parseInt(event.target.value));
  }

  render() {
    return (
      <div>
      Box Width
      <NumberTextField 
        value={this.props.model.width}
        min={1}
        max={3}
        onChange={this.handleWidthChange}
        
      />
      column
      <br />
      Box Height
      <NumberTextField 
        value={this.props.model.height}
        min={1}
        max={10}
        onChange={this.handleHeightChange}
      />
      rows
      </div>
    );
  }
}

Main.propTypes = {
  handleWidthChange: PropTypes.func.isRequired,
  handleHeightChange: PropTypes.func.isRequired,
  model: PropTypes.object
}