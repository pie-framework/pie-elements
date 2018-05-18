import React from 'react';
import PropTypes from 'prop-types';
import Main from './main';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import reverse from 'lodash/reverse';

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

  modelChanged = () => {
    this.props.onModelChanged(this.state.model);
  };

  updateModel = model => {
    this.setState({model}, () => {
      this.modelChanged();
    });
  };

  onPromptChanged = prompt => {
    const update = cloneDeep(this.state.model);
    update.prompt = prompt;
    this.updateModel(update);
  };

  onChoiceChanged = (index, data) => {
    const {model} = this.state;
    const choice = model.choices[index];
    merge(choice, data);
    model.choices.splice(index, 1, choice);
    this.updateModel(model);
  };

  onResponseTypeChanged = count => {
    const update = cloneDeep(this.state.model);
    update.responseType = count;
    this.updateModel(update);
  }

  onChoiceLabelChanged = e => {
    const update = cloneDeep(this.state.model);
    update.keyMode = e;
    this.updateModel(update);
  }

  onOrderReversed = () => {
    const update = cloneDeep(this.state.model);
    reverse(update.choices);
    this.updateModel(update);
  }

  onLabelTypeChanged = (e) => {
    const update = cloneDeep(this.state.model);
    const selected = update.meta[e];
    const activeLang = update.activeLang;
    let data = [];
    selected.map(choice => {
      choice.label.map(value => {
        if(value.lang === activeLang){
          data.push(value);
        }
      });
    });
    update.choices = this.refactorArray(update.likert,data);
    this.updateModel(update);
  }

  refactorArray(count,data){
    switch (count){
      case '3':
        for(let i=0; i<2; i++){
          data.shift();
          data.pop();
        }
        return data;
      case '5':
        data.shift();
        data.pop();
        return data;
      default:
        return data;
    }
  }

  render() {
    const props = {
      model: this.state.model,
      onPromptChanged: this.onPromptChanged,
      onChoiceChanged: this.onChoiceChanged,
      onResponseTypeChanged: this.onResponseTypeChanged,
      onChoiceLabelChanged: this.onChoiceLabelChanged,
      onOrderReversed: this.onOrderReversed,
      onLabelTypeChanged: this.onLabelTypeChanged
    };

    return <Main {...props} />;
  }

}