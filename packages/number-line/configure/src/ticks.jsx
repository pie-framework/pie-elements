import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { NumberTextFieldCustom } from '@pie-lib/pie-toolbox/config-ui';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import * as math from 'mathjs';

// This const will store available tick interval types.
export const TickIntervals = ['Integer', 'Fraction', 'Decimal'];

export const Ticks = (props) => {
  const {
    classes,
    ticksModel = {
      tickIntervalType: 'Decimal',
      integerTick: 0,
      fractionTick: '0/1',
      decimalTick: 0,
      fractionLabel: '0/1',
      decimalLabel: 0,
    },
    onChange,
    data = {
      minorLimits: { min: 0, max: 1 },
      minorValues: { fraction: [], decimal: [], rounded: [] },
      majorValues: { fraction: [], decimal: [], rounded: [] },
    }, // added default values if not present in model.
  } = props;

  /*
   * Function to validate minor values object
   * */
  const validateMinorValuesObject = () => {
    if (!data.minorValues) {
      return false;
    }
    return !!(data.minorValues.fraction || data.minorValues.decimal || data.minorValues.rounded);
  };

  /*
   * Function to validate major values object
   * */
  const validateMajorValuesObject = () => {
    if (!data.majorValues) {
      return false;
    }
    return !!(data.majorValues.fraction || data.majorValues.decimal || data.majorValues.rounded);
  };

  /*
   * Function to handle tick interval type radio group change
   * @param e change event object
   * @param tickIntervalType string value for changed tick interval type
   * */
  const changeTickIntervalType = (e, tickIntervalType) => {
    if (!TickIntervals.includes(tickIntervalType)) {
      return;
    }
    ticksModel.tickIntervalType = tickIntervalType;
    onChange({ ticksModel });
  };

  /*
   * Function to handle change in integer tick interval
   * @param e change event object
   * @param integerTick number value for changed tick
   * */
  const changeIntegerTick = (e, integerTick) => {
    ticksModel.integerTick = integerTick;
    ticksModel.fractionTick = integerTick.toString();
    ticksModel.decimalTick = integerTick;
    onChange({ ticksModel });
  };

  /*
   * Function to handle change in fraction tick interval
   * @param e change event object
   * @param fractionTick string value for changed tick
   * */
  const changeFractionTick = (e, fractionTick) => {
    if (validateMinorValuesObject()) {
      ticksModel.fractionTick = fractionTick;
      ticksModel.decimalTick = data.minorValues.decimal[data.minorValues.fraction.indexOf(ticksModel.fractionTick)];
      onChange({ ticksModel });
    }
  };

  /*
   * Function to handle change in decimal tick interval
   * @param e change event object
   * @param decimalTick number value for changed tick
   * */
  const changeDecimalTick = (e, decimalTick) => {
    if (validateMinorValuesObject()) {
      ticksModel.decimalTick = data.minorValues.decimal[data.minorValues.rounded.indexOf(decimalTick)];
      ticksModel.fractionTick = data.minorValues.fraction[data.minorValues.decimal.indexOf(ticksModel.decimalTick)];
      onChange({ ticksModel });
    }
  };

  /*
   * Function to handle change in fraction label interval value
   * @param e change event object
   * @param fractionLabel string value for changed label interval
   * */
  const changeFractionLabel = (e, fractionLabel) => {
    if (validateMajorValuesObject()) {
      ticksModel.fractionLabel = fractionLabel;
      ticksModel.decimalLabel = data.majorValues.decimal[data.majorValues.fraction.indexOf(ticksModel.fractionLabel)];
      onChange({ ticksModel });
    }
  };

  /*
   * Function to handle change in decimal label interval value
   * @param e change event object
   * @param decimalLabel number value for changed label interval
   * */
  const changeDecimalLabel = (e, decimalLabel) => {
    if (validateMajorValuesObject()) {
      ticksModel.decimalLabel = data.majorValues.decimal[data.majorValues.rounded.indexOf(decimalLabel)];
      ticksModel.fractionLabel = data.majorValues.fraction[data.majorValues.decimal.indexOf(ticksModel.decimalLabel)];
      onChange({ ticksModel });
    }
  };

  return (
    <div className={classes.displayFlex}>
      <div className={classes.flexCol1}>
        <label>Tick Interval</label>
        <RadioGroup
          aria-label="tick-interval-type"
          name="tickIntervalType"
          value={ticksModel.tickIntervalType}
          onChange={changeTickIntervalType}
        >
          <table className={classes.tableFixed}>
            <tbody>
              <tr className={classes.radioInputs}>
                <td className={classes.labelWidth}>
                  <FormControlLabel
                    value="Integer"
                    control={<Radio checked={ticksModel.tickIntervalType === 'Integer'} />}
                    label="Integer"
                    disabled={data.minorLimits.max < 1}
                  />
                </td>
                <td>
                  <NumberTextFieldCustom
                    value={ticksModel.integerTick}
                    min={math.number(math.ceil(data.minorLimits.min))}
                    max={math.number(math.ceil(data.minorLimits.max))}
                    step={1}
                    onlyIntegersAllowed={true}
                    className={classes.nl}
                    inputClassName={classes.numberTextField}
                    onChange={changeIntegerTick}
                    variant={'outlined'}
                    type={'number'}
                    disabled={ticksModel.tickIntervalType !== 'Integer' || data.minorLimits.max < 1}
                  />
                </td>
              </tr>
              <tr className={classes.radioInputs}>
                <td className={classes.labelWidth}>
                  <FormControlLabel
                    value="Fraction"
                    control={<Radio checked={ticksModel.tickIntervalType === 'Fraction'} />}
                    label="Unit Fraction"
                  />
                </td>
                <td>
                  <NumberTextFieldCustom
                    value={ticksModel.fractionTick}
                    min={math.number(data.minorLimits.min)}
                    max={math.number(data.minorLimits.max)}
                    customValues={data.minorValues.fraction}
                    className={classes.nl}
                    inputClassName={classes.numberTextField}
                    onChange={changeFractionTick}
                    variant={'outlined'}
                    type={'text'}
                    disabled={ticksModel.tickIntervalType !== 'Fraction'}
                  />
                </td>
              </tr>
              <tr className={classes.radioInputs}>
                <td className={classes.labelWidth}>
                  <FormControlLabel
                    value="Decimal"
                    control={<Radio checked={ticksModel.tickIntervalType === 'Decimal'} />}
                    label="Decimal"
                  />
                </td>
                <td>
                  <NumberTextFieldCustom
                    value={math.number(math.round(ticksModel.decimalTick, 3))}
                    min={math.number(data.minorLimits.min)}
                    max={math.number(data.minorLimits.max)}
                    customValues={data.minorValues.rounded}
                    className={classes.nl}
                    inputClassName={classes.numberTextField}
                    onChange={changeDecimalTick}
                    variant={'outlined'}
                    type={'number'}
                    disabled={ticksModel.tickIntervalType !== 'Decimal'}
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
          value={
            ticksModel.tickIntervalType === 'Fraction'
              ? ticksModel.fractionLabel
              : math.number(math.round(ticksModel.decimalLabel, 3))
          }
          className={classes.numberTextField}
          variant={'outlined'}
          customValues={
            ticksModel.tickIntervalType === 'Fraction' ? data.majorValues.fraction : data.majorValues.rounded
          }
          type={ticksModel.tickIntervalType === 'Fraction' ? 'text' : 'number'}
          onChange={ticksModel.tickIntervalType === 'Fraction' ? changeFractionLabel : changeDecimalLabel}
        />
      </div>
    </div>
  );
};
Ticks.propTypes = {
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  ticksModel: PropTypes.shape({
    integerTick: PropTypes.number,
    decimalTick: PropTypes.number,
    fractionTick: PropTypes.string,
    tickIntervalType: PropTypes.string,
    fractionLabel: PropTypes.string,
    decimalLabel: PropTypes.number,
  }),
  data: PropTypes.object,
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
  },
  tableFixed: {
    'table-layout': 'fixed',
    width: '100%',
  },
  labelWidth: {
    width: '35%',
  },
});
export default withStyles(styles)(Ticks);
