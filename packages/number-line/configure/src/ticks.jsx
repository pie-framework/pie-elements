import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { NumberTextFieldCustom } from '@pie-lib/config-ui';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import * as math from 'mathjs';
import { color } from '@pie-lib/render-ui';

const DisplayFlex = styled('div')({
  display: 'flex',
});

const FlexCol1 = styled('div')({
  display: 'flex',
  flexFlow: 'column',
  gap: '10px',
  width: '65%',
});

const FlexCol2 = styled('div')({
  display: 'flex',
  flexFlow: 'column',
  gap: '10px',
});

const RadioInputs = styled('tr')({
  display: 'flex',
  alignItems: 'center',
  paddingTop: '5px',
  paddingBottom: '5px',
});

const TableFixed = styled('table')({
  tableLayout: 'fixed',
  width: '100%',
});

const LabelWidth = styled('td')({
  width: '35%',
});

const CustomColorRadio = styled(Radio)({
  color: `${color.tertiary()} !important`,
});

const StyledNumberTextFieldCustom = styled(NumberTextFieldCustom)({
  '& input': {
    maxWidth: '145px',
    cursor: 'default',
  },
});

// This const will store available tick interval types.
export const TickIntervals = ['Integer', 'Fraction', 'Decimal'];

export const Ticks = (props) => {
  const { ticks, onChange, minorLimits, minorValues, majorValues } = props;

  //Format decimal value of label interval to fraction
  const fractionMajor = math.fraction(math.number(ticks.major));
  const fractionMajorString =
    fractionMajor.d === 1 ? fractionMajor.n.toString() : fractionMajor.n + '/' + fractionMajor.d;

  /*
   * Function to handle tick interval type radio group change
   * @param e change event object
   * @param tickIntervalType string value for changed tick interval type
   * */
  const changeTickIntervalType = (e, tickIntervalType) => {
    if (!TickIntervals.includes(tickIntervalType)) {
      return;
    }
    if (tickIntervalType === 'Integer') {
      ticks.minor = ticks.integerTick;
    } else if (tickIntervalType === 'Decimal') {
      ticks.minor = ticks.decimalTick;
    } else if (tickIntervalType === 'Fraction') {
      ticks.minor = math.number(math.fraction(ticks.fractionTick));
    }
    ticks.tickIntervalType = tickIntervalType;
    onChange({ ticks });
  };

  /*
   * Function to handle change in integer tick interval
   * @param e change event object
   * @param integerTick number value for changed tick
   * */
  const changeIntegerTick = (e, integerTick) => {
    if (ticks.tickIntervalType === 'Integer') {
      ticks.integerTick = integerTick;
      ticks.minor = integerTick;
      onChange({ ticks });
    }
  };

  /*
   * Function to handle change in fraction tick interval
   * @param e change event object
   * @param fractionTick string value for changed tick
   * */
  const changeFractionTick = (e, fractionTick) => {
    if (ticks.tickIntervalType === 'Fraction') {
      ticks.fractionTick = fractionTick;
      ticks.minor = math.number(math.fraction(fractionTick));
      onChange({ ticks });
    }
  };

  /*
   * Function to handle change in decimal tick interval
   * @param e change event object
   * @param decimalTick number value for changed tick
   * */
  const changeDecimalTick = (e, decimalTick) => {
    if (ticks.tickIntervalType === 'Decimal') {
      ticks.decimalTick = decimalTick;
      ticks.minor = decimalTick;
      onChange({ ticks });
    }
  };

  /*
   * Function to handle change in fraction label interval value
   * @param e change event object
   * @param fractionLabel string value for changed label interval
   * */
  const changeFractionLabel = (e, fractionLabel) => {
    if (ticks.tickIntervalType === 'Fraction') {
      ticks.major = math.number(math.fraction(fractionLabel));
      onChange({ ticks });
    }
  };

  /*
   * Function to handle change in decimal label interval value
   * @param e change event object
   * @param decimalLabel number value for changed label interval
   * */
  const changeDecimalLabel = (e, decimalLabel) => {
    if (ticks.tickIntervalType === 'Decimal' || ticks.tickIntervalType === 'Integer') {
      ticks.major = decimalLabel;
      onChange({ ticks });
    }
  };

  return (
    <DisplayFlex>
      <FlexCol1>
        <label>Tick Interval</label>
        <RadioGroup
          aria-label="tick-interval-type"
          name="tickIntervalType"
          value={ticks.tickIntervalType}
          onChange={changeTickIntervalType}
        >
          <TableFixed>
            <tbody>
              <RadioInputs>
                <LabelWidth>
                  <FormControlLabel
                    value="Integer"
                    control={<CustomColorRadio checked={ticks.tickIntervalType === 'Integer'} />}
                    label="Integer"
                    disabled={minorLimits.max < 1}
                  />
                </LabelWidth>
                <td>
                  <StyledNumberTextFieldCustom
                    value={ticks.integerTick}
                    min={math.number(math.ceil(minorLimits.min))}
                    max={math.number(math.floor(minorLimits.max))}
                    step={1}
                    onlyIntegersAllowed={true}
                    onChange={changeIntegerTick}
                    variant={'outlined'}
                    type={'number'}
                    disabled={ticks.tickIntervalType !== 'Integer' || minorLimits.max < 1}
                    key={
                      ticks.tickIntervalType !== 'Integer' || minorLimits.max < 1 ? 'integerDisabled' : 'integerEnabled'
                    }
                  />
                </td>
              </RadioInputs>
              <RadioInputs>
                <LabelWidth>
                  <FormControlLabel
                    value="Fraction"
                    control={<CustomColorRadio checked={ticks.tickIntervalType === 'Fraction'} />}
                    label="Unit Fraction"
                    disabled={minorValues.fraction.length === 0}
                  />
                </LabelWidth>
                <td>
                  <StyledNumberTextFieldCustom
                    value={ticks.fractionTick}
                    customValues={minorValues.fraction}
                    onChange={changeFractionTick}
                    variant={'outlined'}
                    type={'text'}
                    disabled={ticks.tickIntervalType !== 'Fraction' || minorValues.fraction.length === 0}
                    key={
                      ticks.tickIntervalType !== 'Fraction' || minorValues.fraction.length === 0
                        ? 'fractionDisabled'
                        : 'fractionEnabled'
                    }
                  />
                </td>
              </RadioInputs>
              <RadioInputs>
                <LabelWidth>
                  <FormControlLabel
                    value="Decimal"
                    control={<CustomColorRadio checked={ticks.tickIntervalType === 'Decimal'} />}
                    label="Decimal"
                    disabled={minorValues.decimal.length === 0}
                  />
                </LabelWidth>
                <td>
                  <StyledNumberTextFieldCustom
                    value={ticks.decimalTick}
                    customValues={minorValues.decimal}
                    onChange={changeDecimalTick}
                    variant={'outlined'}
                    type={'number'}
                    disabled={ticks.tickIntervalType !== 'Decimal' || minorValues.decimal.length === 0}
                    key={
                      ticks.tickIntervalType !== 'Decimal' || minorValues.decimal.length === 0
                        ? 'decimalDisabled'
                        : 'decimalEnabled'
                    }
                  />
                </td>
              </RadioInputs>
            </tbody>
          </TableFixed>
        </RadioGroup>
      </FlexCol1>
      <FlexCol2>
        <label>Label Interval</label>
        <StyledNumberTextFieldCustom
          value={ticks.tickIntervalType === 'Fraction' ? fractionMajorString : ticks.major}
          variant={'outlined'}
          customValues={ticks.tickIntervalType === 'Fraction' ? majorValues.fraction : majorValues.decimal}
          type={ticks.tickIntervalType === 'Fraction' ? 'text' : 'number'}
          onChange={ticks.tickIntervalType === 'Fraction' ? changeFractionLabel : changeDecimalLabel}
        />
      </FlexCol2>
    </DisplayFlex>
  );
};
Ticks.propTypes = {
  onChange: PropTypes.func,
  ticks: PropTypes.object,
  minorLimits: PropTypes.object,
  minorValues: PropTypes.object,
  majorValues: PropTypes.object,
};

export default Ticks;
