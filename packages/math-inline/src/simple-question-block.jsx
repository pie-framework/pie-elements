import React from 'react';
import { MathToolbar } from '@pie-lib/math-toolbar';
import { mq } from '@pie-lib/math-input';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { color } from '@pie-lib/render-ui';

export class SimpleQuestionBlockRaw extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    onSimpleResponseChange: PropTypes.func,
    model: PropTypes.object.isRequired,
    emptyResponse: PropTypes.bool,
    session: PropTypes.object.isRequired,
    showCorrect: PropTypes.bool
  };

  state = {
    showKeypad: true
  };

  onFocus = () => this.setState({ showKeypad: true });

  onBlur = (e) => {
    const { relatedTarget, currentTarget } = e || {};

    if (!relatedTarget || !currentTarget || (relatedTarget.offsetParent !== currentTarget.offsetParent)) {
      this.setState({ showKeypad: false });
    }
  };

  render() {
    const {
      classes,
      model,
      showCorrect,
      session,
      emptyResponse,
      onSimpleResponseChange
    } = this.props;
    const { config, disabled, correctness, view } = model || {};

    if (!config) {
      return;
    }

    const correct = correctness && correctness.correct;
    const showAsCorrect = !emptyResponse && (showCorrect || correct);
    const showAsIncorrect = !emptyResponse && !correct && !showCorrect && !view;
    const { responses, equationEditor } = config;

    return (
      <div className={classes.expression}>
        {showCorrect || disabled ? (
          <div
            className={cx(classes.static, {
              [classes.incorrect]: !emptyResponse && !correct && !showCorrect,
                  [classes.correct]: !emptyResponse && (correct || showCorrect)
            })}
          >
            <mq.Static
              latex={
                showCorrect ? (responses && responses.length && responses[0].answer) : (session.response || '')
              }
            />
          </div>
        ) : (
          <MathToolbar
            classNames={{ editor: classes.responseEditor }}
            latex={session.response || ''}
            keypadMode={equationEditor}
            onChange={onSimpleResponseChange}
            onDone={() => {}}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            controlledKeypad={true}
            showKeypad={this.state.showKeypad}
            hideDoneButton={true}
          />
        )}
      </div>
    );
  }
}
const SimpleQuestionBlock = withStyles(theme => ({
  responseEditor: {
    display: 'flex',
    justifyContent: 'center',
    width: 'auto',
    maxWidth: 'fit-content',
    height: 'auto',
    textAlign: 'left',
    padding: theme.spacing.unit,
    '&.mq-math-mode': {
      border: `1px solid ${color.primaryLight()}`
    }
  },
  expression: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    padding: theme.spacing.unit
  },
  static: {
    color: color.text(),
    background: color.background(),
    border: `1px solid ${color.primaryLight()}`,
    width: 'fit-content',
    fontSize: '1rem',
    padding: theme.spacing.unit / 2,
    '& > .mq-math-mode': {
      '& > .mq-hasCursor': {
        '& > .mq-cursor': {
          display: 'none'
        }
      }
    }
  },
  correct: {
    border: `2px solid ${color.correct()} !important`,
    padding: theme.spacing.unit,
    letterSpacing: '0.5px',
  },
  incorrect: {
    border: `2px solid ${color.incorrect()} !important`,
    padding: theme.spacing.unit,
    letterSpacing: '0.5px',
  }
}))(SimpleQuestionBlockRaw);

export default SimpleQuestionBlock;
