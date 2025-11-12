import React from 'react';
import PropTypes from 'prop-types';
import { MiniField } from './number-text-field';
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CardBar from './card-bar';
import { Checkbox } from '@pie-lib/config-ui';
import cloneDeep from 'lodash/cloneDeep';

const GroupInline = styled('div')({
  alignItems: 'center',
  display: 'flex',
  gap: '20px',
});

const Group = styled('div')({
  margin: '12px 0',
});

const InputLabel = styled('label')({
  display: 'block',
  marginBottom: '4px',
});

const StyledSelect = styled(Select)({
  width: '80px',
  alignItems: 'center',
  height: '40px',
  verticalAlign: 'top',
  marginBottom: '8px',
  '& .MuiSelect-select': {
    paddingLeft: '10px',
  },
});

const CheckboxContainer = styled('div')({
  marginLeft: '-15px',
});

const CheckboxLabel = styled('span')({
  verticalAlign: 'middle',
});

export class ModelOptions extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
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
    const { model, modelOptions } = this.props;
    const { maxOfModel, partsPerModel, modelTypeChoices } = modelOptions;

    return (
      <div>
        <CardBar header="Configure Fraction Model"></CardBar>
        <br />
        <GroupInline>
          <Group>
            <InputLabel>Model Type</InputLabel>
            <StyledSelect
              onChange={this.handleSelect}
              value={model.modelTypeSelected}
              MenuProps={{
                transitionDuration: { enter: 225, exit: 195 }
              }}
            >
              {modelTypeChoices.map((choice, index) => (
                <MenuItem key={'item_' + index} value={choice.value}>
                  {choice.label}
                </MenuItem>
              ))}
            </StyledSelect>
          </Group>
          <Group>
            <InputLabel>Max # of Models</InputLabel>
            <MiniField
              min={maxOfModel.min}
              max={maxOfModel.max}
              value={model.maxModelSelected}
              name="max-model"
              onChange={this.changeMaxModel}
            />
          </Group>
          <Group>
            <InputLabel>Parts per Model</InputLabel>
            <MiniField
              min={partsPerModel.min}
              max={partsPerModel.max}
              value={model.partsPerModel}
              name="model-parts"
              onChange={this.changePartModel}
            />
          </Group>
        </GroupInline>
        <CheckboxContainer>
          <Checkbox onChange={this.studentConfig} checked={model.allowedStudentConfig} label={''} />
          <CheckboxLabel>Allow student to configure number of models and parts per model</CheckboxLabel>
        </CheckboxContainer>
      </div>
    );
  }
}

export default ModelOptions;
