import React from 'react';
import PropTypes from 'prop-types';
import { TwoChoice, NChoice, NumberTextField } from '@pie-lib/config-ui';
import { withStyles } from 'material-ui/styles';

const metricLabels = [
  { label: 'Millimeters', value: 'mm' },
  { label: 'Centimeters', value: 'cm' },
  { label: 'Meters', value: 'm' },
  { label: 'Kilometers', value: 'km' }
];
const imperialLabels = [
  { label: 'Inches', value: 'in' },
  { label: 'Feet', value: 'ft' },
  { label: 'Yards', value: 'yd' },
  { label: 'Miles', value: 'm' }
];
const imperialTickOpts = [
  { label: '16', value: '16' },
  { label: '8', value: '8' },
  { label: '4', value: '4' }
];

export class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
  };

  typeChange = t => {
    const { model, onChange } = this.props;
    model.model.config.units = t;
    model.model.config.label = t === 'imperial' ? 'in' : 'cm';
    model.model.config.ticks = t === 'imperial' ? 8 : undefined;
    onChange(model);
  };

  labelChange = l => {
    const { model, onChange } = this.props;
    model.model.config.label = l;
    onChange(model);
  };

  lengthChange = (e, l) => {
    const { model, onChange } = this.props;
    model.model.config.length = l;
    onChange(model);
  };

  ticksChange = t => {
    const { model, onChange } = this.props;
    model.model.config.ticks = parseInt(t, 10);
    onChange(model);
  };

  pixelsPerUnitChange = (e, t) => {
    const { model, onChange } = this.props;
    model.model.config.pixelsPerUnit = parseInt(t, 10);
    onChange(model);
  };

  render() {
    const { model: outerModel, classes } = this.props;
    const { model } = outerModel;

    const labelOpts =
      model.config.units === 'metric' ? metricLabels : imperialLabels;

    return (
      <div>
        <div>
          <TwoChoice
            header="Type"
            value={model.config.units}
            onChange={this.typeChange}
            one={{ label: 'Imperial', value: 'imperial' }}
            two={{ label: 'Metric', value: 'metric' }}
          />

          {model.config.units === 'imperial' && (
            <NChoice
              header="Number of Ticks"
              value={model.config.ticks.toString()}
              onChange={this.ticksChange}
              opts={imperialTickOpts}
            />
          )}
        </div>
        <NChoice
          className={classes.opt}
          header="Label"
          value={model.config.label}
          onChange={this.labelChange}
          opts={labelOpts}
        />
        <div className={classes.row}>
          <NumberTextField
            label={'Length'}
            className={classes.length}
            value={model.config.length}
            max={21}
            min={1}
            onChange={this.lengthChange}
          />
          <NumberTextField
            label={'Pixels per unit'}
            className={classes.pixelsPerUnit}
            value={model.config.pixelsPerUnit}
            max={100}
            min={20}
            onChange={this.pixelsPerUnitChange}
          />
        </div>
        {/* 
          TODO - add popever ? help icon here...
          <HelpButton>Foo bar baz</HelpButton> 
          */}
      </div>
    );
  }
}

const Styled = withStyles(theme => ({
  opt: {
    display: 'flex'
  },
  pixelsPerUnit: {
    width: '100px'
  },
  length: {
    width: '100px'
  },
  row: {
    display: 'flex'
  }
}))(Main);

export default class Stateful extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    model: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      model: props.model
    };
  }

  onChange = model => {
    this.setState({ model }, () => {
      this.props.onChange(this.state.model);
    });
  };
  render() {
    return <Styled model={this.state.model} onChange={this.onChange} />;
  }
}
