import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import { choiceUtils as utils } from '@pie-lib/config-ui';

import Main from './main';

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

  setModel(part, key) {
    const { model } = this.state;

    const { keyMode } = model;
    const { choices, choiceMode, prompt } = model[key];

    part.model = {
      prompt,
      choiceMode,
      keyMode,
      choices,
      partialScoring: false,
      shuffle: false,
      partialScoringLabel: `Each correct response that is correctly checked and each incorrect response
          that is correctly unchecked will be worth 1 point.
          The maximum points is the total number of answer choices.`
    };
  }

  componentDidMount() {
    const partA = document.getElementById('partA');
    const partB = document.getElementById('partB');

    this.setModel(partA, 'partA');
    this.setModel(partB, 'partB');
  }

  // componentWillReceiveProps(props) {
  //   const { disableSidePanel } = props;
  //   const { disableSidePanel: oldDisableProp } = this.props;
  //
  //   if (disableSidePanel !== oldDisableProp) {
  //     this.setState({
  //       disableSidePanel
  //     });
  //   }
  // }
  //
  // onChoiceModeChanged = value => {
  //   const { model } = this.state;
  //
  //   model.choiceMode = value;
  //
  //   if (value === 'radio') {
  //     let correctFound = false;
  //
  //     model.choices = model.choices.map(c => {
  //       if (correctFound) {
  //         c.correct = false;
  //         return c;
  //       }
  //
  //       if (c.correct) {
  //         correctFound = true;
  //       }
  //
  //       return c;
  //     });
  //   }
  //
  //   this.updateModel(model, true);
  // };
  //
  // onRemoveChoice = index => {
  //   const { model } = this.state;
  //   model.choices.splice(index, 1);
  //   this.updateModel(model);
  // };
  //
  // onPartialScoringChanged = () => {
  //   const { model } = this.state;
  //   model.partialScoring = !model.partialScoring;
  //   this.updateModel(model);
  // };
  //
  // onShuffleChanged = () => {
  //   const { model } = this.state;
  //   model.shuffle = !model.shuffle;
  //   this.updateModel(model);
  // };
  //
  modelChanged = (reset) => {
    this.props.onModelChanged(this.state.model, reset);
  };

  updateModel = (model, reset) => {
    this.setState({ model }, () => {
      this.modelChanged(reset);
    });
  };

  onAddChoice = (part) => {
    const { model } = this.state;
    model.choices.push({
      label: 'label',
      value: utils.firstAvailableIndex(model[part].map(c => c.value), 0),
    });
    this.updateModel(model);
  };

  // onKeyModeChanged = value => {
  //   const { model } = this.state;
  //   model.keyMode = value;
  //   this.updateModel(model);
  // };
  //
  // onChoiceChanged = (index, choice) => {
  //   const { model } = this.state;
  //   if (choice.correct && model.choiceMode === 'radio') {
  //     model.choices = model.choices.map(c => {
  //       return merge({}, c, { correct: false });
  //     });
  //   }
  //
  //   model.choices.splice(index, 1, choice);
  //   this.updateModel(model);
  // };
  //
  onPromptChanged = prompt => {
    const update = cloneDeep(this.state.model);
    update.prompt = prompt;
    this.updateModel(update);
  };

  render() {
    const props = {
      model: this.state.model,
      configure: this.props.configure,
      // disableSidePanel: this.state.disableSidePanel,
      // onRemoveChoice: this.onRemoveChoice,
      // onChoiceModeChanged: this.onChoiceModeChanged,
      // onKeyModeChanged: this.onKeyModeChanged,
      // onChoiceChanged: this.onChoiceChanged,
      onAddChoice: this.onAddChoice,
      onPromptChanged: this.onPromptChanged,
      // onDefaultLangChanged: this.onDefaultLangChanged,
      // onPartialScoringChanged: this.onPartialScoringChanged,
      // onShuffleChanged: this.onShuffleChanged,
      // imageSupport: this.props.imageSupport
    };


    return (
      <div>
        <multiple-choice-configure id="partA" />
        <multiple-choice-configure id="partB" />
      </div>
    );
  }
}
