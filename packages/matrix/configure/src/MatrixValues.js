import React from 'react';
import styled from 'styled-components';

import MatrixLabelEditableButton, {ACTION_TYPE} from './MatrixLabelEditableButton';
import isNumeric from './isNumeric';
import NumberInput from './NumberInput';
import PropTypes from 'prop-types';

const columnWidth = '120px';

export const ScoringContainer = styled.div`
  display: grid;
  grid-template-columns: min-content min-content auto;
`;

export const MatrixColumns = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px;
`;

export const ColumnLabelWrapper = styled.div`
  width: ${columnWidth};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RowLabelWrapper = styled.div`
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ValueRowWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ValueItemWrapper = styled.div`
  width: ${columnWidth};
  height: 50px;
  margin: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ScoringRows = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5px;
`;

export const ScoringNumberInputWrapper = styled.div`
  width: 60px;
  justify-self: center;
  align-self: center;
`;

export const GridSeparatorHorizontal = styled.div`
  background: gray;
  width: 100%;
  height: 1px;
`;

export const GridSeparatorVertical = styled.div`
  background: gray;
  width: 1px;
  height: 100%;
`;

export const Content = styled.div`
  padding: 5px;
`;

const MatrixValues = (props) => {
  const { model, onChangeModel } = props;
  const { rowLabels, columnLabels, matrixValues, spellCheckEnabled} = model;

  const onSetMatrixValue = (matrixValueIndex, value) => {
    const matrixValuesClone = {
      ...matrixValues,
    };
    if (isNumeric(value)) {
      matrixValuesClone[matrixValueIndex] = parseInt(value, 10);
    } else {
      delete matrixValuesClone[matrixValueIndex];
    }
    onChangeModel({
      ...model,
      matrixValues: matrixValuesClone
    })
  };

  const onSetColumnLabel = (index, labelValue) => {
    const columnLabelsClone = [...columnLabels];
    columnLabelsClone[index] = labelValue;
    onChangeModel({
      ...model,
      columnLabels: columnLabelsClone
    })
  };


  const onSetRowLabel = (index, labelValue) => {
    const rowLabelsClone = [...rowLabels];
    rowLabelsClone[index] = labelValue;
    onChangeModel({
      ...model,
      rowLabels: rowLabelsClone
    })
  };

  const onActionByColumn = ({ resourceIndex, actionType, setValue }) => {
    const columnLabelIndex = resourceIndex;
    const matrixValuesClone = { ...matrixValues };
    rowLabels.forEach((rowLabel, rowLabelIndex) => {
      switch (actionType) {
        case ACTION_TYPE.clear:
          delete matrixValuesClone[`${rowLabelIndex}-${columnLabelIndex}`];
          break;
        case ACTION_TYPE.sortAscending:
          matrixValuesClone[`${rowLabelIndex}-${columnLabelIndex}`] = rowLabelIndex + 1;
          break;
        case ACTION_TYPE.sortDescending:
          matrixValuesClone[`${rowLabelIndex}-${columnLabelIndex}`] = rowLabels.length - rowLabelIndex;
          break;
        case ACTION_TYPE.set:
          matrixValuesClone[`${rowLabelIndex}-${columnLabelIndex}`] = setValue;
          break;
        default:
          throw 'Incorrect actionType';

      }
    });
    onChangeModel({
      ...model,
      matrixValues: matrixValuesClone
    })
  };

  const onActionByRow = ({ resourceIndex, actionType, setValue }) => {
    const rowLabelIndex = resourceIndex;
    const matrixValuesClone = { ...matrixValues };
    columnLabels.forEach((columnLabel, columnLabelIndex) => {
      switch (actionType) {
        case ACTION_TYPE.clear:
          delete matrixValuesClone[`${rowLabelIndex}-${columnLabelIndex}`];
          break;
        case ACTION_TYPE.sortAscending:
          matrixValuesClone[`${rowLabelIndex}-${columnLabelIndex}`] = rowLabelIndex + 1;
          break;
        case ACTION_TYPE.sortDescending:
          matrixValuesClone[`${rowLabelIndex}-${columnLabelIndex}`] = rowLabels.length - rowLabelIndex;
          break;
        case ACTION_TYPE.set:
          matrixValuesClone[`${rowLabelIndex}-${columnLabelIndex}`] = setValue;
          break;
        default:
          throw 'Incorrect actionType';

      }
    });
    onChangeModel({
      ...model,
      matrixValues: matrixValuesClone
    })
  };

  return (
    <ScoringContainer>
      <div/>
      <GridSeparatorVertical/>
      <MatrixColumns>
        {
          columnLabels.map((value, columnLabelIndex) => (
            <ColumnLabelWrapper key={columnLabelIndex}>
              <MatrixLabelEditableButton
                resourceIndex={columnLabelIndex}
                onAction={onActionByColumn}
                value={value}
                onLabelUpdate={(labelValue) => onSetColumnLabel(columnLabelIndex, labelValue)}
                spellCheck = {spellCheckEnabled}
              />
            </ColumnLabelWrapper>
          ))
        }
      </MatrixColumns>
      <GridSeparatorHorizontal/>
      <GridSeparatorVertical/>
      <GridSeparatorHorizontal/>
      <ScoringRows>
        {
          rowLabels.map((value, rowLabelIndex) => (
            <RowLabelWrapper key={rowLabelIndex}>
              <MatrixLabelEditableButton
                resourceIndex={rowLabelIndex}
                onAction={onActionByRow}
                value={value}
                onLabelUpdate={(labelValue) => onSetRowLabel(rowLabelIndex, labelValue)}
                spellCheck = {spellCheckEnabled}
              />
            </RowLabelWrapper>
          ))
        }
      </ScoringRows>
      <GridSeparatorVertical/>
      <Content>
        {rowLabels.map((row, rowIndex) => {
          return (
            <ValueRowWrapper key={rowIndex}>
              {columnLabels.map((column, entryIndex) => {
                const matrixValueIndex = `${rowIndex}-${entryIndex}`;
                return (
                  <ValueItemWrapper key={entryIndex}>
                    <ScoringNumberInputWrapper>
                      <NumberInput
                        onFieldUpdate={(e) => onSetMatrixValue(matrixValueIndex, e)}
                        name={matrixValueIndex}
                        placeholder='#'
                        fieldValue={{
                          value: isNumeric(matrixValues[matrixValueIndex]) ? matrixValues[matrixValueIndex] : ''
                        }}
                      />
                    </ScoringNumberInputWrapper>
                  </ValueItemWrapper>
                )
              })}
            </ValueRowWrapper>
          );
        })}
      </Content>
    </ScoringContainer>
  );
};

MatrixValues.propTypes = {
  model: PropTypes.object.isRequired,
  onChangeModel: PropTypes.func.isRequired
};

export default MatrixValues;
