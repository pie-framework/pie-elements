import React from 'react';
import PropTypes from 'prop-types';
import { layout, TwoChoice, NChoice, NumberTextField } from '@pie-lib/config-ui';
import { withStyles } from '@material-ui/core/styles';

const metricLabels = [
  { label: 'Millimeters', value: 'mm' },
  { label: 'Centimeters', value: 'cm' },
  { label: 'Meters', value: 'm' },
  { label: 'Kilometers', value: 'km' },
];

const imperialLabels = [
  { label: 'Inches', value: 'in' },
  { label: 'Feet', value: 'ft' },
  { label: 'Yards', value: 'yd' },
  { label: 'Miles', value: 'm' },
];

const imperialTickOpts = [
  { label: '16', value: '16' },
  { label: '8', value: '8' },
  { label: '4', value: '4' },
];

export class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
  };

  measureChange = (measure) => {
    const { model, onChange } = this.props;
    model.measure = measure;
    model.label = measure === 'imperial' ? 'in' : 'cm';
    model.imperialTicks = measure === 'imperial' ? 8 : undefined;

    onChange(model);
  };

  labelChange = (label) => {
    const { model, onChange } = this.props;
    model.label = label;

    onChange(model);
  };

  unitsChange = (e, units) => {
    const { model, onChange } = this.props;
    model.width = units * (model.width / model.units);
    model.units = units;

    onChange(model);
  };

  ticksChange = (ticks) => {
    const { model, onChange } = this.props;
    model.imperialTicks = parseInt(ticks, 10);

    onChange(model);
  };

  pixelsPerUnitChange = (e, ticks) => {
    const { model, onChange } = this.props;
    model.width = model.units * parseInt(ticks, 10);

    onChange(model);
  };

  render() {
    const { model, classes } = this.props;
    const { imperialTicks, label, measure, units, width } = model || {};

    const pixelsPerUnit = width / units;
    const labelOpts = measure === 'metric' ? metricLabels : imperialLabels;

    return (
      <layout.ConfigLayout hideSettings={true} settings={null}>
        <div>
          <TwoChoice
            header="Type"
            value={measure}
            onChange={this.measureChange}
            one={{ label: 'Imperial', value: 'imperial' }}
            two={{ label: 'Metric', value: 'metric' }}
          />

          {measure === 'imperial' && (
            <NChoice
              header="Number of Ticks"
              value={imperialTicks.toString()}
              onChange={this.ticksChange}
              opts={imperialTickOpts}
            />
          )}
        </div>

        <NChoice className={classes.opt} header="Label" value={label} onChange={this.labelChange} opts={labelOpts} />

        <div className={classes.row}>
          <NumberTextField
            label={'Length'}
            className={classes.length}
            value={units}
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
      </layout.ConfigLayout>
    );
  }
}

const Styled = withStyles(() => ({
  opt: {
    display: 'flex',
  },
  pixelsPerUnit: {
    width: '100px',
  },
  length: {
    width: '100px',
  },
  row: {
    display: 'flex',
  },
}))(Main);

export default class Stateful extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    model: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      model: props.model,
    };
  }

  onChange = (model) => {
    this.setState({ model }, () => {
      this.props.onChange(this.state.model);
    });
  };

  render() {
    return <Styled model={this.state.model} onChange={this.onChange} />;
  }
}
