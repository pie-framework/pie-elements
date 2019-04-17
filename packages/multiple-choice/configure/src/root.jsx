import Main from './main';
import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import { choiceUtils as utils } from '@pie-lib/config-ui';

export default class Root extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    configure: PropTypes.object,
    disableSidePanel: PropTypes.bool,
    onModelChanged: PropTypes.func.isRequired,
    imageSupport: PropTypes.object
  };

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

    if (!isEqual(this.state.model, props.model)) {
      this.updateModel(props.model);
    }
  }

  onChoiceModeChanged = value => {
    const { model } = this.state;

    model.choiceMode = value;

    if (value === 'radio') {
      let correctFound = false;

      model.choices = model.choices.map(c => {
        if (correctFound) {
          c.correct = false;
          return c;
        }

        if (c.correct) {
          correctFound = true;
        }

        return c;
      });
    }

    this.updateModel(model, true);
  };

  onRemoveChoice = index => {
    const { model } = this.state;
    model.choices.splice(index, 1);
    this.updateModel(model);
  };

  onPartialScoringChanged = () => {
    const { model } = this.state;
    model.partialScoring = !model.partialScoring;
    this.updateModel(model);
  };

  onLockChoiceOrderChanged = () => {
    const { model } = this.state;
    model.lockChoiceOrder = !model.lockChoiceOrder;
    this.updateModel(model);
  };

  modelChanged = (reset) => {
    this.props.onModelChanged(this.state.model, reset);
  };

  updateModel = (model, reset) => {
    this.setState({ model }, () => {
      this.modelChanged(reset);
    });
  };

  onAddChoice = () => {
    const { model } = this.state;
    model.choices.push({
      label: 'label',
      value: utils.firstAvailableIndex(model.choices.map(c => c.value), 0),
      feedback: {
        type: 'none'
      }
    });
    this.updateModel(model);
  };

  onChoicePrefixChanged = value => {
    const { model } = this.state;
    model.choicePrefix = value;
    this.updateModel(model);
  };

  onChoiceChanged = (index, choice) => {
    const { model } = this.state;
    if (choice.correct && model.choiceMode === 'radio') {
      model.choices = model.choices.map(c => {
        return merge({}, c, { correct: false });
      });
    }

    model.choices.splice(index, 1, choice);
    this.updateModel(model);
  };

  onPromptChanged = itemStem => {
    const update = cloneDeep(this.state.model);
    update.itemStem = itemStem;
    this.updateModel(update);
  };

  render() {
    const props = {
      model: this.state.model,
      configure: this.props.configure,
      disableSidePanel: this.state.disableSidePanel,
      onRemoveChoice: this.onRemoveChoice,
      onChoiceModeChanged: this.onChoiceModeChanged,
      onChoicePrefixChanged: this.onChoicePrefixChanged,
      onChoiceChanged: this.onChoiceChanged,
      onAddChoice: this.onAddChoice,
      onPromptChanged: this.onPromptChanged,
      onDefaultLangChanged: this.onDefaultLangChanged,
      onPartialScoringChanged: this.onPartialScoringChanged,
      onLockChoiceOrderChanged: this.onLockChoiceOrderChanged,
      imageSupport: this.props.imageSupport
    };

    return <Main {...props} />;
  }
}
