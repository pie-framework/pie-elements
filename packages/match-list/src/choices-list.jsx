import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import find from 'lodash/find';
import { DragAnswer } from './answer';

export class ChoicesList extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    session: PropTypes.object.isRequired,
    instanceId: PropTypes.string.isRequired,
    model: PropTypes.object.isRequired,
    disabled: PropTypes.bool.isRequired
  };

  render() {
    const {
      model,
      classes,
      disabled,
      session,
      instanceId
    } = this.props;
    const { config } = model;
    const { duplicates } = config;

    return (
      <div className={classes.answersContainer}>
        {
          config.answers
            .filter(answer => (duplicates || isEmpty(session) || !session.value || isUndefined(find(session.value, val => val === answer.id))))
            .map((answer) => (
              <DragAnswer
                key={answer.id}
                instanceId={instanceId}
                className={classes.choice}
                draggable={true}
                disabled={disabled}
                session={session}
                type={'choice'}
                {...answer}
              />
            ))
        }
      </div>
    );
  }
}

const styles = () => ({
  answersContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 50
  },
  choice: {
    minHeight: '40px',
    minWidth: '200px',
    height: 'initial'
  }
});

export default withStyles(styles)(ChoicesList);