import React from 'react';
import PropTypes from 'prop-types';

// no authoring
export class Main extends React.Component {
  render() {
    return (<div/>);
  }
}

Main.propTypes = {
  classes: PropTypes.object,
  model: PropTypes.object,
  onModelChanged: PropTypes.func,
}

export default Main;
