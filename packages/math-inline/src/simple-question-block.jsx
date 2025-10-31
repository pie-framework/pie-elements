import React from 'react';
import { MathToolbar } from '@pie-lib/math-toolbar';
import { mq } from '@pie-lib/math-input';
import cx from 'classnames';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import { color } from '@pie-lib/render-ui';

export class SimpleQuestionBlockRaw extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    onSimpleResponseChange: PropTypes.func,
    model: PropTypes.object.isRequired,
    emptyResponse: PropTypes.bool,
    session: PropTypes.object.isRequired,
    showCorrect: PropTypes.bool,
    onSubFieldFocus: PropTypes.func.isRequired,
    showKeypad: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.mathToolBarId = `math-toolbar-${new Date().getTime()}`;
  }

  mathToolBarContainsTarget = (e) => document.getElementById(this.mathToolBarId).contains(e.target);

  handleClick = (e) => {
    try {
      if (!this.mathToolBarContainsTarget(e)) {
        this.setState({ showKeypad: false });
      }
    } catch (e) {
      // console.log(e.toString());
    }
  };

  onFocus = () => {
    const { onSubFieldFocus } = this.props;

    onSubFieldFocus(this.mathToolBarId);
  };

  render() {
    const { classes, model, showCorrect, session, emptyResponse, onSimpleResponseChange, showKeypad } = this.props;
    const { config, disabled, correctness } = model || {};

    if (!config) {
      return;
    }

    const correct = correctness && correctness.correct;
    const { responses, equationEditor } = config;

    return (
      <div className={classes.expression} data-keypad={true}>
        {showCorrect || disabled ? (
          <div
            className={cx(classes.static, {
              [classes.incorrect]: !emptyResponse && !correct && !showCorrect,
              [classes.correct]: !emptyResponse && (correct || showCorrect),
            })}
          >
            <mq.Static
              latex={showCorrect ? responses && responses.length && responses[0].answer : session.response || ''}
            />
          </div>
        ) : (
          <div id={this.mathToolBarId}>
            <MathToolbar
              classNames={{ editor: classes.responseEditor }}
              latex={session.response}
              keypadMode={equationEditor}
              onChange={onSimpleResponseChange}
              onDone={() => {}}
              onFocus={this.onFocus}
              controlledKeypad={true}
              showKeypad={showKeypad}
              hideDoneButton={true}
            />
          </div>
        )}
      </div>
    );
  }
}

const SimpleQuestionBlock = withStyles((theme) => ({
  responseEditor: {
    display: 'flex',
    justifyContent: 'center',
    width: 'auto',
    maxWidth: 'fit-content',
    height: 'auto',
    textAlign: 'left',
    padding: theme.spacing.unit,
    '&.mq-math-mode': {
      border: `1px solid ${color.primaryLight()}`,
    },
  },
  expression: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    padding: theme.spacing.unit,
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
          display: 'none',
        },
      },
    },
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
  },
}))(SimpleQuestionBlockRaw);

export default SimpleQuestionBlock;
