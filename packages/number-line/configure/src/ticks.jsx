import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import { NumberTextFieldCustom } from '@pie-lib/config-ui';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import * as math from 'mathjs';
import { color } from '@pie-lib/render-ui';

// This const will store available tick interval types.
export const TickIntervals = ['Integer', 'Fraction', 'Decimal'];

export const Ticks = (props) => {
  const { classes, ticks, onChange, minorLimits, minorValues, majorValues } = props;

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
    <div className={classes.displayFlex}>
      <div className={classes.flexCol1}>
        <label>Tick Interval</label>
        <RadioGroup
          aria-label="tick-interval-type"
          name="tickIntervalType"
          value={ticks.tickIntervalType}
          onChange={changeTickIntervalType}
        >
          <table className={classes.tableFixed}>
            <tbody>
              <tr className={classes.radioInputs}>
                <td className={classes.labelWidth}>
                  <FormControlLabel
                    value="Integer"
                    control={<Radio className={classes.customColor} checked={ticks.tickIntervalType === 'Integer'} />}
                    label="Integer"
                    disabled={minorLimits.max < 1}
                  />
                </td>
                <td>
                  <NumberTextFieldCustom
                    value={ticks.integerTick}
                    min={math.number(math.ceil(minorLimits.min))}
                    max={math.number(math.floor(minorLimits.max))}
                    step={1}
                    onlyIntegersAllowed={true}
                    className={classes.nl}
                    inputClassName={classes.numberTextField}
                    onChange={changeIntegerTick}
                    variant={'outlined'}
                    type={'number'}
                    disabled={ticks.tickIntervalType !== 'Integer' || minorLimits.max < 1}
                    key={
                      ticks.tickIntervalType !== 'Integer' || minorLimits.max < 1 ? 'integerDisabled' : 'integerEnabled'
                    }
                  />
                </td>
              </tr>
              <tr className={classes.radioInputs}>
                <td className={classes.labelWidth}>
                  <FormControlLabel
                    value="Fraction"
                    control={<Radio className={classes.customColor} checked={ticks.tickIntervalType === 'Fraction'} />}
                    label="Unit Fraction"
                    disabled={minorValues.fraction.length === 0}
                  />
                </td>
                <td>
                  <NumberTextFieldCustom
                    value={ticks.fractionTick}
                    customValues={minorValues.fraction}
                    className={classes.nl}
                    inputClassName={classes.numberTextField}
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
              </tr>
              <tr className={classes.radioInputs}>
                <td className={classes.labelWidth}>
                  <FormControlLabel
                    value="Decimal"
                    control={<Radio className={classes.customColor} checked={ticks.tickIntervalType === 'Decimal'} />}
                    label="Decimal"
                    disabled={minorValues.decimal.length === 0}
                  />
                </td>
                <td>
                  <NumberTextFieldCustom
                    value={ticks.decimalTick}
                    customValues={minorValues.decimal}
                    className={classes.nl}
                    inputClassName={classes.numberTextField}
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
              </tr>
            </tbody>
          </table>
        </RadioGroup>
      </div>
      <div className={classes.flexCol2}>
        <label>Label Interval</label>
        <NumberTextFieldCustom
          value={ticks.tickIntervalType === 'Fraction' ? fractionMajorString : ticks.major}
          className={classes.nl}
          inputClassName={classes.numberTextField}
          variant={'outlined'}
          customValues={ticks.tickIntervalType === 'Fraction' ? majorValues.fraction : majorValues.decimal}
          type={ticks.tickIntervalType === 'Fraction' ? 'text' : 'number'}
          onChange={ticks.tickIntervalType === 'Fraction' ? changeFractionLabel : changeDecimalLabel}
        />
      </div>
    </div>
  );
};
Ticks.propTypes = {
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  ticks: PropTypes.object,
  minorLimits: PropTypes.object,
  minorValues: PropTypes.object,
  majorValues: PropTypes.object,
};

const styles = () => ({
  displayFlex: {
    display: 'flex',
  },
  flexCol1: {
    display: 'flex',
    'flex-flow': 'column',
    gap: '10px',
    width: '65%',
  },
  flexCol2: {
    display: 'flex',
    'flex-flow': 'column',
    gap: '10px',
  },
  radioInputs: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: '5px',
    paddingBottom: '5px',
  },
  numberTextField: {
    maxWidth: '145px',
    cursor: 'default',
  },
  tableFixed: {
    'table-layout': 'fixed',
    width: '100%',
  },
  labelWidth: {
    width: '35%',
  },
  customColor: {
    color: `${color.tertiary()} !important`,
  },
});
export default withStyles(styles)(Ticks);
