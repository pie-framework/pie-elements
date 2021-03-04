import React from 'react';
import PropTypes from 'prop-types';
import { withDragContext, swap } from '@pie-lib/drag';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import { color, Feedback } from '@pie-lib/render-ui';
import { withStyles } from '@material-ui/core/styles';
import uniqueId from 'lodash/uniqueId';
import isUndefined from 'lodash/isUndefined';
import findKey from 'lodash/findKey';
import AnswerArea from './answer-area';
import ChoicesList from './choices-list';

export class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    session: PropTypes.object.isRequired,
    onSessionChange: PropTypes.func,
    model: PropTypes.object.isRequired,
    prompt: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.instanceId = uniqueId();
    this.state = {
      showCorrectAnswer: false
    };
  }

  onRemoveAnswer(id) {
    const { session, onSessionChange } = this.props;

    session.value[id] = undefined;

    onSessionChange(session);
  }

  onPlaceAnswer(place, id) {
    const { session, onSessionChange, model } = this.props;
    const { config: { duplicates } } = model;

    if (isUndefined(session.value)) {
      session.value = {};
    }

    const choiceKey = findKey(session.value, val => val === id);

    if (choiceKey && !duplicates) {
      session.value = swap(session.value, choiceKey, place);
    } else {
      session.value[place] = id;
    }

    onSessionChange(session);
  }

  toggleShowCorrect = () => {
    this.setState({ showCorrectAnswer: !this.state.showCorrectAnswer });
  };

  render() {
    const { showCorrectAnswer } = this.state;
    const { classes, model, session } = this.props;
    const { config, mode } = model;
    const { prompt } = config;

    return (
      <div className={classes.mainContainer}>
        <CorrectAnswerToggle
          show={mode === 'evaluate'}
          toggled={showCorrectAnswer}
          onToggle={this.toggleShowCorrect}
        />
        <div
          className={classes.prompt}
          dangerouslySetInnerHTML={{ __html: prompt }}
        />
        <AnswerArea
          instanceId={this.instanceId}
          model={model}
          session={session}
          onPlaceAnswer={(place, id) => this.onPlaceAnswer(place, id)}
          onRemoveAnswer={id => this.onRemoveAnswer(id)}
          disabled={mode !== 'gather'}
          showCorrect={showCorrectAnswer}
        />
        <ChoicesList
          instanceId={this.instanceId}
          model={model}
          session={session}
          disabled={mode !== 'gather'}
        />
        {
          model.correctness &&
          model.feedback &&
          !showCorrectAnswer &&(
            <Feedback
              correctness={model.correctness.correctness}
              feedback={model.feedback}
            />
          )
        }
      </div>
    );
  }
}

const styles = theme => ({
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    color: color.text(),
    backgroundColor: color.background(),
    padding: theme.spacing.unit * 3/2
  },
  promptList: {
    alignItems: 'flex-start'
  },
  main: {
    width: '100%'
  },
  toggle: {
    paddingBottom: theme.spacing.unit * 3
  },
  prompt: {
    verticalAlign: 'middle'
  }
});

export const styledMain = withStyles(styles)(Main);

export default withDragContext(styledMain);