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
      this.setupPart(partA, 'partA');
      this.setupPart(partB, 'partB');
    });
  }

  setupPart(part, key) {
    this.initiatePart(part, key);
    this.captureModelUpdated(part, key);
  }

  initiatePart(part, key) {
    const { model } = this.state;
    const { onModelChanged } = this.props;

    part.model = model[key];

    onModelChanged(model);
  }

  captureModelUpdated(part, key) {
    const self = this;

    part.addEventListener('model.updated', event => {
      event.stopImmediatePropagation();
      self.updateModel(event.update, key);
    });
  }

  updateModel(partModel, key) {
    const { model } = this.state;
    const { onModelChanged } = this.props;

    const repackedModel = {
      ...model,
      [key]: partModel
    };

    this.setState({
      model: repackedModel
    });

    onModelChanged(repackedModel)
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
