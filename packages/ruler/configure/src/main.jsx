import React from 'react';
import PropTypes from 'prop-types';
import { layout, TwoChoice, NChoice, NumberTextField } from '@pie-lib/config-ui';
import { styled } from '@mui/material/styles';

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

const StyledNChoice = styled(NChoice)({
  display: 'flex',
});

const StyledNumberTextField = styled(NumberTextField)({
  width: '100px',
});

const Row = styled('div')({
  display: 'flex',
});

export class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
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
    const { model } = this.props;
    const { extraCSSRules, imperialTicks, label, measure, units, width } = model || {};

    const pixelsPerUnit = width / units;
    const labelOpts = measure === 'metric' ? metricLabels : imperialLabels;

    return (
      <layout.ConfigLayout extraCSSRules={extraCSSRules} hideSettings={true} settings={null}>
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

        <StyledNChoice header="Label" value={label} onChange={this.labelChange} opts={labelOpts} />

        <Row>
          <StyledNumberTextField
            label={'Length'}
            value={units}
            max={30}
            min={5}
            onChange={this.unitsChange}
          />

          <StyledNumberTextField
            label={'Pixels per unit'}
            value={pixelsPerUnit}
            max={100}
            min={25}
            onChange={this.pixelsPerUnitChange}
          />
        </Row>
      </layout.ConfigLayout>
    );
  }
}

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
    return <Main model={this.state.model} onChange={this.onChange} />;
  }
}
