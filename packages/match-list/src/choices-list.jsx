import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import find from 'lodash/find';
import DragAndDropAnswer from './answer';
import { MatchDroppablePlaceholder } from '@pie-lib/drag';

const ChoicesContainer = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const AnswersContainer = styled('div')(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

export class ChoicesList extends React.Component {
  static propTypes = {
    session: PropTypes.object.isRequired,
    instanceId: PropTypes.string.isRequired,
    model: PropTypes.object.isRequired,
    disabled: PropTypes.bool.isRequired,
    onRemoveAnswer: PropTypes.func,
  };

  render() {
    const { model, disabled, session, instanceId, onRemoveAnswer } = this.props;
    const { config } = model;
    const { duplicates } = config;

    const filteredAnswers = config.answers
      .filter(
        (answer) =>
          duplicates ||
          isEmpty(session) ||
          !session.value ||
          isUndefined(find(session.value, (val) => val === answer.id)),
      )
      .map((answer) => (
        <DragAndDropAnswer
          key={answer.id}
          instanceId={instanceId}
          draggable={true}
          disabled={disabled}
          session={session}
          type="choice"
          {...answer}
        />
      ));

    return (
      <ChoicesContainer>
         {MatchDroppablePlaceholder ? (
          <MatchDroppablePlaceholder disabled={disabled} onRemoveAnswer={onRemoveAnswer}>
            {filteredAnswers}
          </MatchDroppablePlaceholder>
        ) : (
          <AnswersContainer>{filteredAnswers}</AnswersContainer>
        )}
      </ChoicesContainer>
    );
  }
}

export default ChoicesList;
