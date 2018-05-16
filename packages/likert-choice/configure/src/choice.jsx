import React, {Component, Fragment} from 'react';
import {NChoice} from '@pie-lib/config-ui';
import PropTypes from 'prop-types';

export default class Choice extends Component {

  static propTypes = {
    onResponseTypeChanged: PropTypes.func.isRequired,
    onChoiceLabelChanged: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {response: '3', choice: 'numbers', type: 'agreement'}
  }

  responseTypeHandler = e => {
    this.setState({response: e});
    this.props.onResponseTypeChanged(e);
  }

  choiceLabelHandler = e => {
    this.setState({choice: e});
    this.props.onChoiceLabelChanged(e);
  }

  render() {
    const {response, choice, type} = this.state;
    return (
      <Fragment>
        <NChoice
          direction="vertical"
          header="Response Type"
          checked={true}
          value={response}
          onChange={this.responseTypeHandler}
          opts={[
            {label: 'Likert 3', value: '3'},
            {label: 'Likert 5', value: '5'},
            {label: 'Likert 7', value: '7'}
          ]}
        />
        <NChoice
          direction="vertical"
          header="Choice Labels"
          value={choice}
          onChange={this.choiceLabelHandler}
          opts={[
            {label: 'Numbers', value: 'numbers'},
            {label: 'Letters', value: 'letters'},
            {label: 'Graphics', value: 'graphics'},
            {label: 'None', value: 'none'}
          ]}
        />
        <NChoice
          direction="vertical"
          header="Label Type"
          value={type}
          onChange={type => this.setState({type})}
          opts={[
            {label: 'Agreement', value: 'agreement'},
            {label: 'Frequency', value: 'frequency'},
            {label: 'Yes/No', value: 'yesno'},
            {label: 'Likelihood', value: 'likelihood'}
          ]}
        />
        <NChoice
          direction="vertical"
          header=""
          value={type}
          onChange={type => this.setState({type})}
          opts={[
            {label: 'Importance', value: 'importance'},
            {label: 'None', value: 'none'},
            {label: 'Custom', value: 'custom'}
          ]}
        />
      </Fragment>
    )
  }

}