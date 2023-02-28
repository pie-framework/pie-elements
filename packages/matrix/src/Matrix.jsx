import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ChoiceInput from './ChoiceInput';
import { Collapsible, PreviewPrompt } from '@pie-lib/render-ui';

const MatrixWrapper = styled.div`
  font-family: Roboto, Arial, Helvetica, sans-serif;
`;

const MatrixGridWrapper = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.gridTemplateColumns};
  grid-column-gap: 30px;
  grid-row-gap: 20px;
  margin-top: 20px;
`;

const TeacherInstructions = styled(Collapsible)`
  margin-bottom: 16px;
`;

const MatrixGridItem = styled.div`
  align-self: center;
  justify-self: center;
  white-space: nowrap;
`;

const Matrix = (props) => {
  const { disabled, prompt, onSessionChange, columnLabels, matrixValues, rowLabels, session, teacherInstructions } =
    props;

  const gridMatrixItems = [];

  for (let rowIndex = 0; rowIndex < rowLabels.length + 1; rowIndex++) {
    for (let columnIndex = 0; columnIndex < columnLabels.length + 1; columnIndex++) {
      let gridMatrixItem;

      if (rowIndex === 0 && columnIndex === 0) {
        gridMatrixItem = null;
      } else if (rowIndex === 0) {
        gridMatrixItem = columnLabels[columnIndex - 1];
      } else if (columnIndex === 0) {
        gridMatrixItem = rowLabels[rowIndex - 1];
      } else {
        const matrixKey = `${rowIndex - 1}-${columnIndex - 1}`;
        const matrixValue = matrixValues[matrixKey];

        gridMatrixItem = (
          <ChoiceInput
            matrixKey={matrixKey}
            matrixValue={matrixValue || 0}
            disabled={disabled}
            onChange={onSessionChange}
            checked={session.value && session.value.hasOwnProperty(matrixKey)}
          />
        );
      }

      gridMatrixItems.push(gridMatrixItem);
    }
  }
  const gridTemplateColumns = [...columnLabels, {}].map(() => 'min-content').join(' ');

  return (
    <MatrixWrapper>
      {teacherInstructions && (
        <TeacherInstructions
          className={teacherInstructions}
          labels={{
            hidden: 'Show Teacher Instructions',
            visible: 'Hide Teacher Instructions',
          }}
        >
          <PreviewPrompt prompt={teacherInstructions} />
        </TeacherInstructions>
      )}

      <PreviewPrompt className="prompt" prompt={prompt} />

      <MatrixGridWrapper gridTemplateColumns={gridTemplateColumns}>
        {gridMatrixItems.map((gridMatrixItem, gridMatrixIndex) => {
          return <MatrixGridItem key={`${gridMatrixIndex}`}>{gridMatrixItem}</MatrixGridItem>;
        })}
      </MatrixGridWrapper>
    </MatrixWrapper>
  );
};

Matrix.propTypes = {
  prompt: PropTypes.string,
  teacherInstructions: PropTypes.string,
  session: PropTypes.object,
  matrixValues: PropTypes.object,
  rowLabels: PropTypes.arrayOf(PropTypes.string),
  columnLabels: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool.isRequired,
  onSessionChange: PropTypes.func.isRequired,
};

Matrix.defaultProps = {
  session: {
    value: {},
  },
};

export default Matrix;
