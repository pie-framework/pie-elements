import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import PropTypes from 'prop-types';

import {
  ColumnsHeader,
  ColumnsWrapper,
  IconWrapper,
  NumberInputFormGroupWrapper,
} from './HeaderCommon';
import {MATRIX_LABEL_TYPE} from './matrixEntities';

const MatrixColumnsSizeHeaderInput = ({ model, onChangeModel }) => {
  const onIncrementColumnsSize = () => {
    onChangeModel({
      ...model,
      columnLabels: [...model.columnLabels, `COLUMN ${model.columnLabels.length + 1}`],
      labelType: MATRIX_LABEL_TYPE.custom
    });
  };

  const onDecrementColumnsSize = () => {
    const columnLabelsLength = model.columnLabels.length;
    if (columnLabelsLength <= 1) {
      return;
    }
    const columnLabelsNext = [...model.columnLabels];
    columnLabelsNext.pop();

    const matrixValuesClone = { ...model.matrixValues };
    model.rowLabels.forEach((rowLabel, rowIndex) => {
      delete matrixValuesClone[`${rowIndex}-${columnLabelsLength - 1}`];
    });

    onChangeModel({
      ...model,
      columnLabels: columnLabelsNext,
      matrixValues: matrixValuesClone,
      labelType: MATRIX_LABEL_TYPE.custom
    });
  };
  return (
    <ColumnsWrapper>
      <ColumnsHeader>Matrix Columns</ColumnsHeader>
      <NumberInputFormGroupWrapper>
        <IconWrapper>
          <RemoveIcon onClick={onDecrementColumnsSize}/>
        </IconWrapper>
        <p>{model.columnLabels.length}</p>
        <IconWrapper>
          <AddIcon onClick={onIncrementColumnsSize}/>
        </IconWrapper>
      </NumberInputFormGroupWrapper>
    </ColumnsWrapper>
  );
};

MatrixColumnsSizeHeaderInput.propTypes = {
  model: PropTypes.object.isRequired,
  onChangeModel: PropTypes.func.isRequired
};

export default MatrixColumnsSizeHeaderInput;
