import React from 'react';
import Main from './main';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

export default class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      model : props.model
    }
  }

  handleModelChange(){
    this.props.onModelChanged(this.state.model);
  }

  update(model){
    this.setState({ model }, () => {
      this.handleModelChange();
    })
  }

  handleWidthChange = (width) => {
    let update = cloneDeep(this.state.model);
    update.width = width;
    this.update(update);
  }

  handleHeightChange = (height) => {
    
    let update = cloneDeep(this.state.model);
    update.height = height;
    this.update(update);
  }  

  render() {
    return (
      <Main
        model={this.state.model}
        handleWidthChange={this.handleWidthChange}
        handleHeightChange={this.handleHeightChange}
      />
    );
  }
}

Root.propTypes = {
  model: PropTypes.object.isRequired,
  onModelChanged: PropTypes.func.isRequired
}