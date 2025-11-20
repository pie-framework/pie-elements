import React from 'react';
import PropTypes from 'prop-types';
import Radio from '@mui/material/Radio';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { color } from '@pie-lib/render-ui';

const ControlsContainer = styled('div')(({ theme }) => ({
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const Column = styled('td')({
  padding: '5px 0',
});

const EmptyTypography = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2),
}));

const RowHeader = styled('th')({
  padding: 0,
});

const RowItem = styled('div')(({ theme, isQuestionText }) => ({
  padding: theme.spacing(1.5),
  textAlign: isQuestionText ? 'left' : 'center',
}));

const Separator = styled('tr')({
  border: 0,
  borderTop: `2.5px solid ${color.primaryLight()}`,
  width: '100%',
});

const Table = styled('table')({
  color: color.text(),
  backgroundColor: color.background(),
  borderCollapse: 'collapse',
  borderSpacing: 0,
  marginBottom: 0,
});

export class AnswerGrid extends React.Component {
  static propTypes = {
    correctAnswers: PropTypes.object,
    view: PropTypes.bool.isRequired,
    showCorrect: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    onAnswerChange: PropTypes.func.isRequired,
    choiceMode: PropTypes.string.isRequired,
    rows: PropTypes.array.isRequired,
    headers: PropTypes.array.isRequired,
    answers: PropTypes.object.isRequired,
  };

  onRowValueChange = (rowId, answerIndex) => (event) => {
    const { onAnswerChange, choiceMode, answers } = this.props;
    const newAnswers = { ...answers };

    if (choiceMode === 'radio') {
      for (let i = 0; i < newAnswers[rowId].length; i++) {
        newAnswers[rowId][i] = false;
      }
    }

    newAnswers[rowId][answerIndex] = event.target.checked;

    onAnswerChange(newAnswers);
  };

  answerIsCorrect = (rowId, rowValue, rowValueIndex) => {
    const { correctAnswers } = this.props;

    return correctAnswers[rowId][rowValueIndex] === rowValue && rowValue === true;
  };

  // needs a separate method because what isn't correct isn't necessarily incorrect
  answerIsIncorrect = (rowId, rowValue, rowValueIndex) => {
    const { correctAnswers } = this.props;

    return (
      (correctAnswers[rowId][rowValueIndex] === true && rowValue === false) ||
      (correctAnswers[rowId][rowValueIndex] === false && rowValue === true)
    );
  };

  render() {
    const { showCorrect, headers, rows, choiceMode, answers, disabled, view } = this.props;
    const Tag = choiceMode === 'radio' ? Radio : Checkbox;
    const evaluate = disabled && !view;

    if (!rows || rows.length === 0) {
      return (
        <ControlsContainer>
          <EmptyTypography component="div">
            There are currently no questions to show.
          </EmptyTypography>
        </ControlsContainer>
      );
    }

    return (
      <ControlsContainer>
        <Table>
          <colgroup>
            {(headers || []).map((header, idx) => (
              <col key={`col-${idx}`} />
            ))}
          </colgroup>

          <thead>
            <tr>
              {(headers || []).map((header, idx) => (
                <RowHeader key={`th-${idx}`} data-colno={`${idx}`} scope="row">
                  <RowItem
                    isQuestionText={idx === 0}
                    dangerouslySetInnerHTML={{ __html: header }}
                  />
                </RowHeader>
              ))}
            </tr>
          </thead>

          {(rows || []).map((row, idx) => (
            <tbody key={`row-${idx}`} role="group">
              <Separator>
                <td key={`td-title-${idx}`} data-colno={'0'}>
                  <RowItem
                    isQuestionText={true}
                    dangerouslySetInnerHTML={{ __html: row.title }}
                  />
                </td>

                {(answers[row.id] || []).map((rowItem, answerIndex) => (
                  <Column key={`td-${idx}-${answerIndex}`} data-colno={`${answerIndex + 1}`}>
                    <RowItem>
                      <Tag
                        sx={{
                          padding: '6px',
                          color: (showCorrect && rowItem === true) ||
                                (evaluate && this.answerIsCorrect(row.id, rowItem, answerIndex)) 
                                ? color.correct() :
                                evaluate && this.answerIsIncorrect(row.id, rowItem, answerIndex)
                                ? color.incorrect() :
                                rowItem === true && !evaluate
                                ? color.primary() :
                                disabled 
                                ? color.disabled() : color.text(),
                          cursor: disabled ? 'not-allowed' : 'pointer',
                          pointerEvents: disabled ? 'initial' : 'auto',
                          opacity: disabled ? 0.7 : 1,
                          '& input': {
                            width: '100% !important',
                          },
                          '&:hover': {
                            color: disabled ? color.disabled() : color.primaryLight(),
                          },
                        }}
                        disabled={disabled}
                        onChange={this.onRowValueChange(row.id, answerIndex)}
                        checked={rowItem === true}
                      />
                    </RowItem>
                  </Column>
                ))}
              </Separator>
            </tbody>
          ))}
        </Table>
      </ControlsContainer>
    );
  }
}

export default AnswerGrid;
