import React from 'react';
import PropTypes from 'prop-types';
import { MiniField } from './number-text-field';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CardBar from './card-bar';
import { Checkbox } from '@pie-lib/pie-toolbox/config-ui';
import cloneDeep from 'lodash/cloneDeep';

export class ModelOptions extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    classes: PropTypes.object,
    onChange: PropTypes.func,
    modelOptions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.changeMaxModel = this.change.bind(this, 'max');
    this.changePartModel = this.change.bind(this, 'part');
    this.studentConfig = this.change.bind(this, 'student-config');
  }

  /**
   * Function to trigger when DOM elements value change for Number type
   * @param {string} key contains key of element
   * @param {object} event contains event object
   * @param {string} value contains value of DOM element
   */
  change(key, event, value) {
    const { model, onChange } = this.props;
    const oldModel = cloneDeep(model);
    let newModel = cloneDeep(model);
    let showDiag = false;
    if (key === 'max') {
      newModel.maxModelSelected = value;
      showDiag = true;
    } else if (key === 'part') {
      newModel.partsPerModel = value;
      showDiag = true;
    } else if (key === 'student-config') {
      newModel.allowedStudentConfig = value;
      showDiag = false;
    }
    onChange(oldModel, newModel, showDiag);
  }

  /**
   * Function to trigger on change of dropdown value model type
   * @param {string} value contains selection value
   */
  handleSelect = (value) => {
    const { model, onChange } = this.props;
    model.modelTypeSelected = value?.target.value;
    onChange(model, { ...model }, false);
  };

  render() {
    const { model, classes, modelOptions } = this.props;
    const { maxOfModel, partsPerModel, modelTypeChoices } = modelOptions;

    return (
      <div>
        <CardBar header="Configure Fraction Model"></CardBar>
        <br />
        <div className={classes.groupInline}>
          <div className={classes.group}>
            <label className={classes.inputLabel}>Model Type</label>
            <Select className={classes.container2} onChange={this.handleSelect} value={model.modelTypeSelected}>
              {modelTypeChoices.map((choice, index) => (
                <MenuItem key={'item_' + index} value={choice.value}>
                  {choice.label}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className={classes.group}>
            <label className={classes.inputLabel}>Max # of Models</label>
            <MiniField
              min={maxOfModel.min}
              max={maxOfModel.max}
              value={model.maxModelSelected}
              name="max-model"
              onChange={this.changeMaxModel}
            />
          </div>
          <div className={classes.group}>
            <label className={classes.inputLabel}>Parts per Model</label>
            <MiniField
              min={partsPerModel.min}
              max={partsPerModel.max}
              value={model.partsPerModel}
              name="model-parts"
              onChange={this.changePartModel}
            />
          </div>
        </div>
        <div className={classes.checkbox}>
          <Checkbox onChange={this.studentConfig} checked={model.allowedStudentConfig} label={''} />
          <span className={classes.chkLabel}>Allow student to configure number of models and parts per model</span>
        </div>
      </div>
    );
  }
}

const styles = () => ({
  groupInline: {
    alignItems: 'center',
    display: 'flex',
    gap: '1.25rem',
  },
  group: {
    margin: '0.75rem 0',
  },
  inputLabel: {
    display: 'block',
    marginBottom: '0.25rem',
  },
  labelWidth: {
    width: '35%',
  },
  container2: {
    width: '80px',
    alignItems: 'center',
    height: '40px',
    verticalAlign: 'top',
    border: '1px solid rgb(0, 0, 0, 0.23)',
    borderRadius: '4px',
    marginBottom: '8px',
    paddingLeft: '10px',
    ':hover': {
      border: '1px solid rgb(0, 0, 0, 0.87)',
    },
  },
  checkbox: {
    marginLeft: '-15px',
  },
  chkLabel: {
    verticalAlign: 'middle',
  },
});

export default withStyles(styles, { name: 'ModelOptions' })(ModelOptions);
