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
              [classes.correct]: showAsCorrect,
              [classes.incorrect]: showAsIncorrect
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
    minWidth: '500px',
    maxWidth: '900px',
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
    width: '100%',
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
    color: color.correct(),
    border: `1px solid ${color.correct()} !important`,
  },
  incorrect: {
    color: color.incorrect(),
    border: `1px solid ${color.incorrect()} !important`,
  }
}))(SimpleQuestionBlockRaw);

export default SimpleQuestionBlock;
