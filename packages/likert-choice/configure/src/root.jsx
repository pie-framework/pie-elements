import React from 'react';
import PropTypes from 'prop-types';
import Main from './main';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import slice from 'lodash/slice';
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
    choice.label.map(k => {
      if (k.lang === model.activeLang) {
        return merge(k, data);
      }
    });
    model.choices.splice(index, 1, choice);
    this.updateModel(model);
    console.log(model);
  };

  onResponseTypeChanged = count => {
    const update = cloneDeep(this.state.model);
    const addTo = {
      value: '',
      label: [
        {lang: 'en-US', label: '', value: ''},
        {lang: 'es-ES', label: '', value: ''}
      ],
    };
    let data = this.createArray(addTo, count, update.choices);
    update.choices = data;
    this.updateModel(update);
  }

  createArray(obj, count, arr) {
    let limit = count - arr.length;
    if (count > arr.length) {
      for (let i = 0; i < limit; i++) {
        arr.push(obj);
      }
    } else {
      arr = slice(arr, 0, count);
    }
    return arr;
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

  render() {
    const props = {
      model: this.state.model,
      onPromptChanged: this.onPromptChanged,
      onChoiceChanged: this.onChoiceChanged,
      onResponseTypeChanged: this.onResponseTypeChanged,
      onChoiceLabelChanged: this.onChoiceLabelChanged,
      onOrderReversed: this.onOrderReversed
    };

    return <Main {...props} />;
  }

}