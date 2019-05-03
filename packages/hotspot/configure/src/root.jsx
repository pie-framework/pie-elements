import Main from './main';
import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
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

  updateModel = (model, reset) => {
    this.setState({ model }, () => {
      this.modelChanged(reset);
    });
  };

  modelChanged = (reset) => {
    this.props.onModelChanged(this.state.model, reset);
  };

  onRemoveShape = index => {
    const { model } = this.state;
    model.shapes.splice(index, 1);
    this.updateModel(model);
  };

  onColorChanged = (colorType, color) => {
    const { model } = this.state;
    model[colorType] = color;
    this.updateModel(model);
  };

  onPromptChanged = prompt => {
    const update = cloneDeep(this.state.model);
    update.prompt = prompt;
    this.updateModel(update);
  };

  onPartialScoringChanged = () => {
    const { model } = this.state;
    model.partialScoring = !model.partialScoring;
    this.updateModel(model);
  };

  onMultipleCorrectChanged = () => {
    const { model } = this.state;
    model.multipleCorrect = !model.multipleCorrect;
    model.shapes = model.shapes.map(shape => ({ ...shape, correct: false }));
    this.updateModel(model);
  };

  onUpdateImageDimension = (dimensions) => {
    const { model } = this.state;
    model.dimensions = dimensions;
    this.updateModel(model);
  };

  onUpdateShapes = (shapes) => {
    const { model } = this.state;
    model.shapes = shapes;
    this.updateModel(model);
  };

  onImageUpload = imageUrl => {
    const { model } = this.state;
    model.imageUrl = imageUrl;
    this.updateModel(model);
  };

  render() {
    const props = {
      configure: this.props.configure,
      disableSidePanel: this.state.disableSidePanel,
      model: this.state.model,
      onColorChanged: this.onColorChanged,
      onImageUpload: this.onImageUpload,
      onMultipleCorrectChanged: this.onMultipleCorrectChanged,
      onPartialScoringChanged: this.onPartialScoringChanged,
      onPromptChanged: this.onPromptChanged,
      onRemoveShape: this.onRemoveShape,
      onUpdateImageDimension: this.onUpdateImageDimension,
      onUpdateShapes: this.onUpdateShapes
    };

    return <Main {...props} />;
  }
}

Root.propTypes = {
  configure: PropTypes.object,
  disableSidePanel: PropTypes.bool,
  model: PropTypes.object.isRequired,
  onModelChanged: PropTypes.func.isRequired
};

export default Root;
