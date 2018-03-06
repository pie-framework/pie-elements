import React from 'react';
import Main from './main';
import cloneDeep from 'lodash/cloneDeep';

export default class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      model: props.model
    }
  }

  handleModelChange() {
    this.props.onModelChanged(this.state.model);
  }

  update(model) {
    this.setState({ model }, () => {
      this.handleModelChange();
    })
  }

  onAddChoice = () => {
    const update = cloneDeep(this.state.model);
    update.choices.push({
      correct: false,
      value: '',
      feedback: { type: 'default' },
      label: ''
    });

    this.update(update);
  }

  onChoiceChange = (index, newChoice) => {
    const update = cloneDeep(this.state.model);
    if (newChoice.correct) {
      update.choices.forEach(c => c.correct = false);
    }
    update.choices.splice(index, 1, newChoice);
    this.update(update);
  }

  onRemoveChoice = (indexToRemove) => {
    let update = cloneDeep(this.state.model);
    update.choices.splice(indexToRemove, 1);
    this.update(update);
  }

  onPromptChange = (prompt) => {
    let update = cloneDeep(this.state.model);
    update.prompt = prompt;
    this.update(update);
  }

  render() {
    return (
      <Main
        model={this.state.model}
        onPromptChange={this.onPromptChange}
        onChoiceChange={this.onChoiceChange}
        onRemoveChoice={this.onRemoveChoice}
        onAddChoice={this.onAddChoice}
      />
    );
  }
}