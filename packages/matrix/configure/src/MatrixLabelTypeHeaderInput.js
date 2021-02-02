import React from 'react';
import styled from 'styled-components';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import {MATRIX_LABEL_TYPE} from './matrixEntities'
import {ColumnsWrapper, ColumnsHeader} from './HeaderCommon';
import columnLabelsGenerator from './columnLabelsGenerator';
import PropTypes from 'prop-types';

const Flex = styled.div`
  display: flex;
`;

const MatrixLabelTypeHeaderInput = ({ model, onChangeModel }) => {
  const onChangeLabelType = (e) => {
    const labelType = e.target.value;
    const modelNew = { ...model, labelType };
    if (labelType !== MATRIX_LABEL_TYPE.custom) {
      modelNew.columnLabels = columnLabelsGenerator(labelType, model.columnLabels.length)
    }
    onChangeModel(modelNew);
  };
  const isMatrixTypeSelectionEnabled = [3, 5, 7].includes(model.columnLabels.length);
  return (
    <ColumnsWrapper>
      <ColumnsHeader>
        Matrix Type
      </ColumnsHeader>

      <Flex>
        <RadioGroup
          aria-label='matrixLabelType'
          name='matrixLabelType'
          value={model.labelType}
          onChange={onChangeLabelType}>
          <FormControlLabel
            disabled={!isMatrixTypeSelectionEnabled}
            value={MATRIX_LABEL_TYPE.agreement}
            control={<Radio/>} label='Agreement'/>
          <FormControlLabel
            disabled={!isMatrixTypeSelectionEnabled}
            value={MATRIX_LABEL_TYPE.frequency}
            control={<Radio/>}
            label='Frequency'/>
          <FormControlLabel
            disabled={!isMatrixTypeSelectionEnabled}
            value={MATRIX_LABEL_TYPE.yesNo}
            control={<Radio/>}
            label='Yes/No'/>
        </RadioGroup>

        <RadioGroup
          aria-label='matrixLabelType'
          name='matrixLabelType'
          value={model.labelType}
          onChange={onChangeLabelType}>
          <FormControlLabel
            disabled={!isMatrixTypeSelectionEnabled}
            value={MATRIX_LABEL_TYPE.importance}
            control={<Radio/>}
            label='Importance'/>
          <FormControlLabel
            disabled={!isMatrixTypeSelectionEnabled}
            value={MATRIX_LABEL_TYPE.likelihood}
            control={<Radio/>}
            label='Likelihood'/>
          <FormControlLabel
            disabled={!isMatrixTypeSelectionEnabled}
            value={MATRIX_LABEL_TYPE.like}
            control={<Radio/>}
            label='Like'/>
        </RadioGroup>

        <RadioGroup
          aria-label='matrixLabelType'
          name='matrixLabelType'
          value={model.labelType}
          onChange={onChangeLabelType}>
          <FormControlLabel value={MATRIX_LABEL_TYPE.custom} control={<Radio/>} label='Custom'/>
        </RadioGroup>
      </Flex>
    </ColumnsWrapper>
  )
};

MatrixLabelTypeHeaderInput.propTypes = {
  model: PropTypes.object.isRequired,
  onChangeModel: PropTypes.func.isRequired
};

export default MatrixLabelTypeHeaderInput;
