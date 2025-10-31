import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import find from 'lodash/find';
import { DragAnswer } from './answer';
import { MatchDroppablePlaceholder } from '@pie-lib/drag';

export class ChoicesList extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    session: PropTypes.object.isRequired,
    instanceId: PropTypes.string.isRequired,
    model: PropTypes.object.isRequired,
    disabled: PropTypes.bool.isRequired,
    onRemoveAnswer: PropTypes.func,
  };

  render() {
    const { model, classes, disabled, session, instanceId, onRemoveAnswer } = this.props;
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
        <DragAnswer
          key={answer.id}
          instanceId={instanceId}
          className={classes.choice}
          draggable={true}
          disabled={disabled}
          session={session}
          type="choice"
          {...answer}
        />
      ));

    return (
      <div className={classes.choicesContainer}>
        {MatchDroppablePlaceholder ? (
          <MatchDroppablePlaceholder disabled={disabled} onRemoveAnswer={onRemoveAnswer}>
            {filteredAnswers}
          </MatchDroppablePlaceholder>
        ) : (
          <div className={classes.answersContainer}>{filteredAnswers}</div>
        )}
      </div>
    );
  }
}

const styles = (theme) => ({
  choicesContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  answersContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  choice: {
    minHeight: '40px',
    minWidth: '200px',
    height: 'initial',
    margin: theme.spacing.unit / 2,
  },
});

export default withStyles(styles)(ChoicesList);
