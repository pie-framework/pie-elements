import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { NumberTextFieldCustom } from '@pie-lib/pie-toolbox/config-ui';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import * as math from 'mathjs';

export const TickIntervals = ['Integer', 'Fraction', 'Decimal'];

export const Ticks = (props) => {
  const { classes, ticksModel, onChange, data } = props;

  const changeTickIntervalType = (e, tickIntervalType) => {
    if (!TickIntervals.includes(tickIntervalType)) {
      return;
    }
    ticksModel.tickIntervalType = tickIntervalType;
    onChange({ ticksModel });
  };

  const changeIntegerTick = (e, integerTick) => {
    ticksModel.integerTick = integerTick;
    ticksModel.fractionTick = integerTick.toString();
    ticksModel.decimalTick = integerTick;
    onChange({ ticksModel });
  };

  const changeFractionTick = (e, fractionTick) => {
    ticksModel.fractionTick = fractionTick;
    ticksModel.decimalTick = data.minorValues.decimal[data.minorValues.fraction.indexOf(ticksModel.fractionTick)];
    onChange({ ticksModel });
  };

  const changeDecimalTick = (e, decimalTick) => {
    ticksModel.decimalTick = data.minorValues.decimal[data.minorValues.rounded.indexOf(decimalTick)];
    ticksModel.fractionTick = data.minorValues.fraction[data.minorValues.decimal.indexOf(ticksModel.decimalTick)];
    onChange({ ticksModel });
  };

  const changeFractionLabel = (e, fractionLabel) => {
    ticksModel.fractionLabel = fractionLabel;
    ticksModel.decimalLabel = data.majorValues.decimal[data.majorValues.fraction.indexOf(ticksModel.fractionLabel)];
    onChange({ ticksModel });
  };

  const changeDecimalLabel = (e, decimalLabel) => {
    ticksModel.decimalLabel = data.majorValues.decimal[data.majorValues.rounded.indexOf(decimalLabel)];
    ticksModel.fractionLabel = data.majorValues.fraction[data.majorValues.decimal.indexOf(ticksModel.decimalLabel)];
    onChange({ ticksModel });
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
