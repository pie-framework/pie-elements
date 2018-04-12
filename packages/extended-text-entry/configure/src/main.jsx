import React from 'react';
import { NumberTextField } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.handleWidthChange = this.handleWidthChange.bind(this);
    this.handleHeightChange = this.handleHeightChange.bind(this);
  }

  handleWidthChange(event) {
    this.props.handleBoxResize(parseInt(event.target.value), 'width');
  }

  handleHeightChange(event) {
    this.props.handleBoxResize(parseInt(event.target.value), 'height');
  }

  render() {
    return (
      <div>
        Box Width
        <NumberTextField 
          value={parseInt(this.props.model.width)}
          min={1}
          max={3}
          onChange={this.handleWidthChange}
        />
        column
        <br />
        Box Height
        <NumberTextField 
          value={parseInt(this.props.model.height)}
          min={1}
          max={3}
          onChange={this.handleHeightChange}
        />
        rows
      </div>
    );
  }
}

Main.propTypes = {
  handleBoxResize: PropTypes.func.isRequired,
  model: PropTypes.object
};
