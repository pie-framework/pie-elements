import React from 'react';
import PropTypes from 'prop-types';

class Root extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      model: props.model,
      disableSidePanel: props.disableSidePanel
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    const { disableSidePanel } = props;
    const { disableSidePanel: oldDisableProp } = this.props;

    if (disableSidePanel !== oldDisableProp) {
      this.setState({
        disableSidePanel
      });
    }
  }

  render() {
    return <div>Drawing reponse config</div>;
  }
}

Root.propTypes = {
  configure: PropTypes.object,
  disableSidePanel: PropTypes.bool,
  model: PropTypes.object.isRequired,
  onModelChanged: PropTypes.func.isRequired
};

export default Root;
