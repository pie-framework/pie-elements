import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {MiniField} from './number-text-field-custom';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import * as math from 'mathjs';

export const Ticks = (props) => {
	const {
		classes, ticksModel, onChange, data
	} = props;
	
	const changeTickIntervalType = (e, tickIntervalType) => {
		ticksModel.tickIntervalType = tickIntervalType;
		onChange({ticksModel});
	};

	const changeIntegerTick = (e, integerTick) => {
		ticksModel.integerTick = integerTick;
		ticksModel.fractionTick = integerTick.toString();
		ticksModel.decimalTick = integerTick;
		onChange({ticksModel});
	};

	const changeFractionTick = (e, fractionTick) => {
		ticksModel.fractionTick = fractionTick;
		ticksModel.decimalTick = data.minorValues.decimal[data.minorValues.fraction.indexOf(ticksModel.fractionTick)];
		onChange({ticksModel});
	};

	const changeDecimalTick = (e, decimalTick) => {
		ticksModel.decimalTick = data.minorValues.decimal[data.minorValues.rounded.indexOf(decimalTick)];
		ticksModel.fractionTick = data.minorValues.fraction[data.minorValues.decimal.indexOf(ticksModel.decimalTick)];
		onChange({ticksModel});
	};

	const changeFractionLabel = (e, fractionLabel) => {
		ticksModel.fractionLabel = fractionLabel;
		ticksModel.decimalLabel = data.majorValues.decimal[data.majorValues.fraction.indexOf(ticksModel.fractionLabel)];
		onChange({ticksModel});
	};

	const changeDecimalLabel = (e, decimalLabel) => {
		ticksModel.decimalLabel = data.majorValues.decimal[data.majorValues.rounded.indexOf(decimalLabel)];
		ticksModel.fractionLabel = data.majorValues.fraction[data.majorValues.decimal.indexOf(ticksModel.decimalLabel)];
		onChange({ticksModel});
	};
	
	return (
		<div className={classes.displayFlex}>
			<div className={classes.flexCol1}>
				<label>Tick Interval</label>
				<RadioGroup
					aria-label="tick-interval-type"
					name="tickIntervalType"
					value={ticksModel.tickIntervalType}
					onChange={changeTickIntervalType}>
					<table className={classes.tableFixed}>
						<tbody>
							<tr className={classes.radioInputs}>
								<td className={classes.labelWidth}>
									<FormControlLabel
										value="I"
										control={<Radio checked={ticksModel.tickIntervalType === "I"}/>}
										label="Integer"
										disabled={data.minorLimits.max < 1}
									/>
								</td>
								<td>
									<MiniField
										value={ticksModel.integerTick}
										min={math.number(math.floor(data.minorLimits.min))}
										max={math.number(math.ceil(data.minorLimits.max))}
										step={1}
										onlyIntegersAllowed={true}
										className={classes.nl}
										inputClassName={classes.numberTextField}
										onChange={changeIntegerTick}
										variant={"outlined"}
										type={"number"}
										disabled={ticksModel.tickIntervalType !== "I" || data.minorLimits.max < 1}
									/>
								</td>
							</tr>
							<tr className={classes.radioInputs}>
								<td className={classes.labelWidth}>
									<FormControlLabel
										value="F"
										control={<Radio checked={ticksModel.tickIntervalType === "F"}/>}
										label="Unit Fraction"
									/>
								</td>
								<td>
									<MiniField
										value={ticksModel.fractionTick}
										min={math.number(data.minorLimits.min)}
										max={math.number(data.minorLimits.max)}
										customValues={data.minorValues.fraction}
										className={classes.nl}
										inputClassName={classes.numberTextField}
										onChange={changeFractionTick}
										variant={"outlined"}
										type={"text"}
										disabled={ticksModel.tickIntervalType !== "F"}
									/>
								</td>
							</tr>
							<tr className={classes.radioInputs}>
								<td className={classes.labelWidth}>
									<FormControlLabel
										value="D"
										control={<Radio checked={ticksModel.tickIntervalType === "D"}/>}
										label="Decimal"
									/>
								</td>
								<td>
									<MiniField
										value={math.number(math.round(ticksModel.decimalTick,3))}
										min={math.number(data.minorLimits.min)}
										max={math.number(data.minorLimits.max)}
										customValues={data.minorValues.rounded}
										className={classes.nl}
										inputClassName={classes.numberTextField}
										onChange={changeDecimalTick}
										variant={"outlined"}
										type={"number"}
										disabled={ticksModel.tickIntervalType !== "D"}
									/>
								</td>
							</tr>
						</tbody>
					</table>
				</RadioGroup>
			</div>
			<div className={classes.flexCol2}>
				<label>Label Interval</label>
				<MiniField
					value={ticksModel.tickIntervalType === "F" ? ticksModel.fractionLabel : math.number(math.round(ticksModel.decimalLabel,3))}
					className={classes.numberTextField}
					variant={"outlined"}
					customValues={ticksModel.tickIntervalType === "F" ? data.majorValues.fraction : data.majorValues.rounded}
					type={ticksModel.tickIntervalType === "F" ? "text" : "number"}
					onChange={ticksModel.tickIntervalType === "F" ? changeFractionLabel : changeDecimalLabel}/>
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
		width: '65%'
	},
	flexCol2: {
		display: 'flex',
		'flex-flow': 'column',
		gap: '10px',
	},
	radioInputs: {
		display: 'flex',
		'align-items': 'center',
		paddingTop: '5px',
		paddingBottom: '5px',
	},
	numberTextField: {
		maxWidth: '145px',
	},
	tableFixed: {
		'table-layout': 'fixed',
		width: '100%'
	},
	labelWidth: {
		width: '35%'
	},
});
export default withStyles(styles)(Ticks);
