import Main from './main';
import React from 'react';
import merge from 'lodash/merge';
import PropTypes from 'prop-types';
import { choiceUtils as utils } from '@pie-lib/config-ui';

export default class Root extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    onModelChanged: PropTypes.func.isRequired,
    imageSupport: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      model: props.model
    };
    this.cachedModel = props.model;
  }

  onChoiceModeChanged = value => {
    this.cachedModel.choiceMode = value;

    if (value === 'radio') {
      let correctFound = false;

      this.cachedModel.choices = this.cachedModel.choices.map(c => {
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

    this.updateModel(true);
  };

  onRemoveChoice = index => {
    this.cachedModel.choices.splice(index, 1);
    this.updateModel();
  };

  onPartialScoringChanged = partialScoring => {
    this.cachedModel.partialScoring = partialScoring;
    this.updateModel();
  };

  modelChanged = (reset) => {
    this.props.onModelChanged(this.cachedModel, reset);
    this.setState({
      model: this.cachedModel
    });
  };

  updateModel = (reset) => {
    this.modelChanged(reset);
  };

  onAddChoice = () => {
    this.cachedModel.choices.push({
      label: 'label',
      value: utils.firstAvailableIndex(this.cachedModel.choices.map(c => c.value), 0),
      feedback: {
        type: 'none'
      }
    });
    this.updateModel();
  };

  onKeyModeChanged = value => {
    this.cachedModel.keyMode = value;
    this.updateModel();
  };

  onChoiceChanged = (index, choice) => {
    if (choice.correct && this.cachedModel.choiceMode === 'radio') {
      this.cachedModel.choices = this.cachedModel.choices.map(c => {
        return merge({}, c, { correct: false });
      });
    }

    this.cachedModel.choices.splice(index, 1, choice);
    this.updateModel();
  };

  onPromptChanged = prompt => {
    this.cachedModel.prompt = prompt;
    this.updateModel();
  };

  render() {
    const props = {
      model: this.state.model,
      onRemoveChoice: this.onRemoveChoice,
      onChoiceModeChanged: this.onChoiceModeChanged,
      onKeyModeChanged: this.onKeyModeChanged,
      onChoiceChanged: this.onChoiceChanged,
      onAddChoice: this.onAddChoice,
      onPromptChanged: this.onPromptChanged,
      onDefaultLangChanged: this.onDefaultLangChanged,
      onPartialScoringChanged: this.onPartialScoringChanged,
      imageSupport: this.props.imageSupport
    };

    return <Main {...props} />;
  }
}
