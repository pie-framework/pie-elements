import Design from './design';
import React from 'react';
import { withDragContext } from '@pie-ui/placement-ordering';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

const styles = {
  tabBar: {
    display: 'flex',
    justifyContent: 'space-between'
  }
};

class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object,
    onModelChanged: PropTypes.func,
    classes: PropTypes.object.isRequired,
    imageSupport: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      model: props.model,
      index: 0
    };

    this.onTabIndexChange = (event, index) => {
      this.setState({ index });
    };

    this.onPartialScoringChange = partialScoring => {
      const { onModelChanged } = this.props;
      const model = cloneDeep(this.state.model);
      model.partialScoring = partialScoring;
      this.setState({ model }, () => {
        onModelChanged(this.state.model);
      });
    };
  }

  modelChanged = (reset) => {
    this.props.onModelChanged(this.state.model, reset);
  };

  updateModel = (model, reset) => {
    this.setState({ model }, () => {
      this.modelChanged(reset);
    });
  };

  render() {
    const { imageSupport } = this.props;
    const { model } = this.state;

    return (
      <Design
        model={model}
        onModelChanged={this.onModelChanged}
        imageSupport={imageSupport}
        updateModel={this.updateModel}
      />
    );
  }
}

export default withDragContext(withStyles(styles)(Main));
