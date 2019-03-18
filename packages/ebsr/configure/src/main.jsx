import React from 'react';
import PropTypes from 'prop-types';

import MultipleChoiceConfigure from '@pie-element/multiple-choice/configure/lib';

export default class Root extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    onModelChanged: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    if(!customElements.get('multiple-choice-configure')){
      customElements.define('multiple-choice-configure', MultipleChoiceConfigure);
    }

    this.state = {
      model: props.model,
    };
  }

  componentDidMount() {
    const { partA, partB } = this;

    customElements.whenDefined('multiple-choice-configure').then(() => {
      this.configurePart(partA, 'partA');
      this.configurePart(partB, 'partB');
    });
  }

  configurePart(part, key) {
    this.updatePart(part, key, true);
    this.handleModelUpdateListener(part, key);
  }

  updatePart(part, key, setModel) {
    const { onModelChanged } = this.props;
    const { model } = this.state;

    const { keyMode } = model;
    const { choices, choiceMode, labelMode, prompt } = model[key];

    const partModel = {
      prompt,
      choiceMode,
      keyMode,
      choices,
      labelMode,
      // hardcoded for now
      lockChoiceOrder: false,
      sequentialLabel: false
    };

    if (setModel) {
      part.model = partModel;
    }

    const repackedModel = {
      ...model,
      [key]: partModel,
    };

    onModelChanged(repackedModel);
  }

  handleModelUpdateListener(part, key) {
    const self = this;

    part.addEventListener('model.updated', (model) => {
      self.updatePart(model.update, key);
    })
  }

  render() {
    return (
      <div>
        <multiple-choice-configure ref={ref => { this.partA = ref }} />
        <multiple-choice-configure ref={ref => { this.partB = ref }} />
      </div>
    );
  }
}
