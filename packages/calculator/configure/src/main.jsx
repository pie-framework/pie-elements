import React from 'react';
import PropTypes from 'prop-types';
import { layout, TwoChoice } from '@pie-lib/config-ui';
import { CalculatorLayout } from '@pie-element/calculator';
import Typography from '@mui/material/Typography';

const MainTypes = {
  model: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export class Main extends React.Component {
  static propTypes = MainTypes;

  onModeChange = (mode) => {
    const { model, onChange } = this.props;
    const update = { ...model, mode };

    onChange(update);
  };

  render() {
    const { model } = this.props;

    return (
      <layout.ConfigLayout hideSettings={true} settings={null}>
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

        <Typography style={{ paddingTop: '4px' }}>
          Please note that the calculators are tools for students and do not record answers.
        </Typography>
      </layout.ConfigLayout>
    );
  }
}

export default class Stateful extends React.Component {
  static propTypes = MainTypes;

  constructor(props) {
    super(props);
    this.state = { model: props.model };
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.setState({ model: props.model });
  }

  onChange = (model) => {
    this.setState({ model }, () => {
      this.props.onChange(this.state.model);
    });
  };

  render() {
    return <Main model={this.state.model} onChange={this.onChange} />;
  }
}
