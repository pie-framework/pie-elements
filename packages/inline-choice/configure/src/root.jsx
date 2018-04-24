import React from 'react';
import Main from './main';
import cloneDeep from 'lodash/cloneDeep';
import PropTypes from 'prop-types';
import includes from 'lodash/includes';

const firstAvailableIndex = (values, index) => {
  if (includes(values, `${index}`)) {
    return firstAvailableIndex(values, index + 1);
  } else {
    return `${index}`;
  }
};
export default class Root extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    onModelChanged: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      model: props.model
    };
  }

  handleModelChange() {
    const { onModelChanged } = this.props;
    onModelChanged(this.state.model);
  }

  update(model) {
    this.setState({ model }, () => {
      this.handleModelChange();
    });
  }

  onAddChoice = () => {
    const { model } = this.state;
    const update = cloneDeep(model);
    update.choices.push({
      correct: false,
      value: firstAvailableIndex(model.choices.map(c => c.value), 0),
      feedback: { type: 'default' },
      label: ''
    });

    this.update(update);
  };

  onChoiceChange = (index, newChoice) => {
    const update = cloneDeep(this.state.model);
    if (newChoice.correct) {
      update.choices.forEach(c => (c.correct = false));
    }
    update.choices.splice(index, 1, newChoice);
    this.update(update);
  };

  onRemoveChoice = indexToRemove => {
    let update = cloneDeep(this.state.model);
    update.choices.splice(indexToRemove, 1);
    this.update(update);
  };

  onPromptChange = prompt => {
    let update = cloneDeep(this.state.model);
    update.prompt = prompt;
    this.update(update);
  };

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
