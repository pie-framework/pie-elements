import React from 'react';
import PropTypes from 'prop-types';
import Main from './main';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import reverse from 'lodash/reverse';
import {meta} from './meta';

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
    let selected = meta[update.labelType];
    update.responseType = count;
    update.choices= this.refactorArray(count,selected,update.activeLang);
    this.updateModel(update);
  }

  onChoiceLabelChanged = e => {
    const update = cloneDeep(this.state.model);
    update.keyMode = e;
    this.updateModel(update);
  }

  onOrderReversed = () => {
    const update = cloneDeep(this.state.model);
    update.reverse = !update.reverse
    reverse(update.choices);
    this.updateModel(update);
  }

  onLabelTypeChanged = (e) => {
    const update = cloneDeep(this.state.model);
    let selected = meta[e];
    update.labelType = e;
    update.choices = this.refactorArray(update.responseType,selected,update.activeLang);
    this.updateModel(update);
  }

  refactorArray = (count, arr, activeLang) => {
    let data = [];
    arr.map(choice => {
      choice.label.map(value => {
        if(value.lang === activeLang){
          data.push(value);
        }
      });
    });
    switch (count) {
      case '3':
        for (let i = 0; i < 2; i++) {
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

  onLangChanged = (lang) => {
    const update = cloneDeep(this.state.model);
    let selected = meta[update.labelType];
    update[lang] = lang;
    update.choices = this.refactorArray(update.responseType,selected,lang);
    this.updateModel(update);
  }

  render() {
    const props = {
      model: this.state.model,
      onPromptChanged: this.onPromptChanged,
      onChoiceChanged: this.onChoiceChanged,
      onResponseTypeChanged: this.onResponseTypeChanged,
      onChoiceLabelChanged: this.onChoiceLabelChanged,
      onOrderReversed: this.onOrderReversed,
      onLabelTypeChanged: this.onLabelTypeChanged,
      onLangChanged: this.onLangChanged
    };

    return <Main {...props} />;
  }

}