import React from 'react';
import styled from 'styled-components';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import { MATRIX_LABEL_TYPE } from './matrixEntities';
import { ColumnsWrapper, ColumnsHeader } from './HeaderCommon';
import columnLabelsGenerator from './columnLabelsGenerator';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import { color } from '@pie-lib/render-ui';

const Flex = styled.div`
  display: flex;
`;

const styles = (theme) => ({
  customColor: {
    color: `${color.tertiary()} !important`,
  },
});

const MatrixLabelTypeHeaderInput = ({ model, onChangeModel, classes }) => {
  const onChangeLabelType = (e) => {
    const labelType = e.target.value;
    const modelNew = { ...model, labelType };
    if (labelType !== MATRIX_LABEL_TYPE.custom) {
      modelNew.columnLabels = columnLabelsGenerator(labelType, model.columnLabels.length);
    }
    onChangeModel(modelNew);
  };
  const isMatrixTypeSelectionEnabled = [3, 5, 7].includes(model.columnLabels.length);
  return (
    <ColumnsWrapper>
      <ColumnsHeader>Matrix Type</ColumnsHeader>

      <Flex>
        <RadioGroup
          aria-label="matrixLabelType"
          name="matrixLabelType"
          value={model.labelType}
          onChange={onChangeLabelType}
        >
          <FormControlLabel
            disabled={!isMatrixTypeSelectionEnabled}
            value={MATRIX_LABEL_TYPE.agreement}
            control={<Radio className={classes.customColor} />}
            label="Agreement"
          />
          <FormControlLabel
            disabled={!isMatrixTypeSelectionEnabled}
            value={MATRIX_LABEL_TYPE.frequency}
            control={<Radio className={classes.customColor} />}
            label="Frequency"
          />
          <FormControlLabel
            disabled={!isMatrixTypeSelectionEnabled}
            value={MATRIX_LABEL_TYPE.yesNo}
            control={<Radio className={classes.customColor} />}
            label="Yes/No"
          />
        </RadioGroup>

        <RadioGroup
          aria-label="matrixLabelType"
          name="matrixLabelType"
          value={model.labelType}
          onChange={onChangeLabelType}
        >
          <FormControlLabel
            disabled={!isMatrixTypeSelectionEnabled}
            value={MATRIX_LABEL_TYPE.importance}
            control={<Radio className={classes.customColor} />}
            label="Importance"
          />
          <FormControlLabel
            disabled={!isMatrixTypeSelectionEnabled}
            value={MATRIX_LABEL_TYPE.likelihood}
            control={<Radio className={classes.customColor} />}
            label="Likelihood"
          />
          <FormControlLabel
            disabled={!isMatrixTypeSelectionEnabled}
            value={MATRIX_LABEL_TYPE.like}
            control={<Radio className={classes.customColor} />}
            label="Like"
          />
        </RadioGroup>

        <RadioGroup
          aria-label="matrixLabelType"
          name="matrixLabelType"
          value={model.labelType}
          onChange={onChangeLabelType}
        >
          <FormControlLabel
            value={MATRIX_LABEL_TYPE.custom}
            control={<Radio className={classes.customColor} />}
            label="Custom"
          />
        </RadioGroup>
      </Flex>
    </ColumnsWrapper>
  );
};

MatrixLabelTypeHeaderInput.propTypes = {
  model: PropTypes.object.isRequired,
  onChangeModel: PropTypes.func.isRequired,
};

export default withStyles(styles)(MatrixLabelTypeHeaderInput);
