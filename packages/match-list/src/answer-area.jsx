import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import reduce from 'lodash/reduce';

import Arrow from './arrow';
import DragAndDropAnswer from './answer';

export class AnswerArea extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    session: PropTypes.object.isRequired,
    showCorrect: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    onSessionChange: PropTypes.func,
    onRemoveAnswer: PropTypes.func,
    onPlaceAnswer: PropTypes.func.isRequired,
    instanceId: PropTypes.string.isRequired,
    model: PropTypes.object.isRequired,
    prompt: PropTypes.string
  };

  getAnswerFromSession = promptId => {
    const { model, session, showCorrect } = this.props;
    const { config } = model;
    const answerId = showCorrect
      ? config.prompts.find(p => p.id === promptId).relatedAnswer
      : session.value && session.value[promptId];
    const answer = config.answers.find(answer => answer.id === answerId);

    return answer || {};
  };

  getCorrectOrIncorrectMap = () => {
    const { model, session, showCorrect } = this.props;
    const { config } = model;
    const sessionValue =
      session.value || config.prompts.reduce((obj, prompt) => {
        obj[prompt.id] = undefined;
        return obj;
      }, {});

    if (model.mode !== 'evaluate') {
      return {};
    }

    if (showCorrect) {
      return config.prompts.reduce((obj, prompt) => {
        obj[prompt.id] = true;

        return obj;
      }, {});
    }

    const correctPromptMap = config.prompts.reduce((obj, prompt) => {
      if (!isUndefined(prompt.relatedAnswer)) {
        obj[prompt.id] = prompt.relatedAnswer;
      }

      return obj;
    }, {});

    return reduce(sessionValue, (obj, val, key) => {
      obj[key] = correctPromptMap[key] === sessionValue[key];

      return obj;
    }, {});
  };

  buildRows = () => {
    const { model } = this.props;
    const { config } = model;
    const prompts = (config.prompts || []);

    return prompts.map(prompt => {
      const sessionAnswer = this.getAnswerFromSession(prompt.id);

      return {
        ...prompt,
        sessionAnswer
      };
    });
  };

  render() {
    const {
      classes,
      disabled,
      onPlaceAnswer,
      instanceId,
      onRemoveAnswer
    } = this.props;
    const rows = this.buildRows();
    const correctnessMap = this.getCorrectOrIncorrectMap();

    return (
      <div className={classes.itemList}>
        {rows.map(({ sessionAnswer, title, id }, index) => {

          return (
            <div
              className={classes.row}
              style={{
                display: 'flex'
              }}
              key={index}
            >
              <div
                className={classes.promptEntry}
                dangerouslySetInnerHTML={{ __html: title }}
              />
              <div
                className={classes.arrowEntry}
              >
                <Arrow direction="left" />
                <Arrow />
              </div>
              <DragAndDropAnswer
                key={index}
                className={classes.answer}
                index={index}
                promptId={id}
                correct={correctnessMap[id]}
                draggable={!isEmpty(sessionAnswer)}
                disabled={disabled}
                instanceId={instanceId}
                id={sessionAnswer.id}
                onPlaceAnswer={(place, id) => onPlaceAnswer(place, id)}
                title={sessionAnswer.title}
                type={'target'}
                onRemoveChoice={() => onRemoveAnswer(id)}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

const styles = () => ({
  answer: {
    flex: 1
  },
  arrowEntry: {
    alignItems: 'normal',
    display: 'flex',
    height: 40,
    margin: '10px 20px'
  },
  itemList: {
    alignItems: 'flex-start',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  promptEntry: {
    border: '1px solid #c2c2c2',
    boxSizing: 'border-box',
    flex: 1,
    margin: '10px 0',
    minHeight: 40,
    overflow: 'hidden',
    padding: 10,
    textAlign: 'center',
    width: '100%',
    wordBreak: 'break-word'
  },
  row: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  }
});

export default withStyles(styles)(AnswerArea);
