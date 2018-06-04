import React from 'react';
import { TwoChoice } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { CalculatorLayout } from '@pie-ui/calculator';

const MainTypes = {
  model: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export class Main extends React.Component {
  static propTypes = MainTypes;

  onModeChange = mode => {
    const { model } = this.props;
    const update = { ...model, mode };
    this.props.onChange(update);
  };

  render() {
    const { model } = this.props;
    return (
      <div>
        <TwoChoice
          header="Choose a Calculator"
          value={model.mode}
          onChange={this.onModeChange}
          one={{ label: 'Basic', value: 'basic' }}
          two={{ label: 'Scientific', value: 'scientific' }}
        />
        <br />
        <CalculatorLayout mode={model.mode} onClose={() => ({})} />
        <br />
        <br />
        <Typography>
          Please note that the calculators are tools for students and do not
          record answers.
        </Typography>
      </div>
    );
  }
}

export default class Stateful extends React.Component {
  static propTypes = MainTypes;

  constructor(props) {
    super(props);
    this.state = {
      model: props.model
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ model: props.model });
  }

  onChange = model => {
    this.setState({ model }, () => {
      this.props.onChange(this.state.model);
    });
  };

  render() {
    return <Main model={this.state.model} onChange={this.onChange} />;
  }
}
