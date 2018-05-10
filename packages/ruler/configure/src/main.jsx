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

  measureChange = t => {
    const { model, onChange } = this.props;
    model.measure = t;
    model.label = t === 'imperial' ? 'in' : 'cm';
    model.imperialTicks = t === 'imperial' ? 8 : undefined;
    onChange(model);
  };

  labelChange = l => {
    const { model, onChange } = this.props;
    model.label = l;
    onChange(model);
  };

  unitsChange = (e, l) => {
    const { model, onChange } = this.props;
    model.width = l * (model.width / model.units);
    model.units = l;
    onChange(model);
  };

  ticksChange = t => {
    const { model, onChange } = this.props;
    model.imperialTicks = parseInt(t, 10);
    onChange(model);
  };

  pixelsPerUnitChange = (e, t) => {
    const { model, onChange } = this.props;
    model.width = model.units * parseInt(t, 10);
    onChange(model);
  };

  render() {
    const { model, classes } = this.props;

    const pixelsPerUnit = model.width / model.units;
    const labelOpts =
      model.measure === 'metric' ? metricLabels : imperialLabels;

    return (
      <div>
        <div>
          <TwoChoice
            header="Type"
            value={model.measure}
            onChange={this.measureChange}
            one={{ label: 'Imperial', value: 'imperial' }}
            two={{ label: 'Metric', value: 'metric' }}
          />

          {model.measure === 'imperial' && (
            <NChoice
              header="Number of Ticks"
              value={model.imperialTicks.toString()}
              onChange={this.ticksChange}
              opts={imperialTickOpts}
            />
          )}
        </div>
        <NChoice
          className={classes.opt}
          header="Label"
          value={model.label}
          onChange={this.labelChange}
          opts={labelOpts}
        />
        <div className={classes.row}>
          <NumberTextField
            label={'Length'}
            className={classes.length}
            value={model.units}
            max={30}
            min={5}
            onChange={this.unitsChange}
          />
          <NumberTextField
            label={'Pixels per unit'}
            className={classes.pixelsPerUnit}
            value={pixelsPerUnit}
            max={100}
            min={25}
            onChange={this.pixelsPerUnitChange}
          />
        </div>
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
