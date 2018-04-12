import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import Main from './main';

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

  handleBoxResize = (value, type) => {
    let update = cloneDeep(this.state.model);
    update[type] = value;
    this.update(update);
  }  

  render() {
    return (
      <div>
        <Main
          model={this.state.model}
          handleBoxResize={this.handleBoxResize}        
        />
      </div>
    );
  }
}

Root.propTypes = {
  model: PropTypes.object.isRequired,
  onModelChanged: PropTypes.func.isRequired
}