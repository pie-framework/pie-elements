import React from 'react';
import PropTypes from 'prop-types';
import Main from './main';

export default class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      model: props.model
    };
  }

  change = model => {
    const { onChange } = this.props;
    this.setState({ model }, () => {
      onChange(this.state.model);
    });
  };

  render() {
    return <Main model={this.state.model} onChange={this.change} />;
  }
}

Root.propTypes = {
  model: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};
