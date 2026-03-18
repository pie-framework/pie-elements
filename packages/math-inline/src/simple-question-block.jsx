import React from 'react';
import { MathToolbar } from '@pie-lib/math-toolbar';
import { mq } from '@pie-lib/math-input';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { color } from '@pie-lib/render-ui';

const Expression = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
}));

const Static = styled('div', {
  shouldForwardProp: (prop) => !['isCorrect', 'isIncorrect'].includes(prop),
})(({ theme, isCorrect, isIncorrect }) => ({
  color: color.text(),
  background: color.background(),
  border: isCorrect
    ? `2px solid ${color.correct()} !important`
    : isIncorrect
      ? `2px solid ${color.incorrect()} !important`
      : `1px solid ${color.primaryLight()}`,
  width: 'fit-content',
  fontSize: '1rem',
  padding: isCorrect || isIncorrect ? theme.spacing(1) : theme.spacing(0.5),
  letterSpacing: (isCorrect || isIncorrect) ? '0.5px' : 'normal',
  '& > .mq-math-mode': {
    '& > .mq-hasCursor': {
      '& > .mq-cursor': {
        display: 'none',
      },
    },
  },
}));

// CSS for MathToolbar classNames (used as strings)
if (typeof document !== 'undefined') {
  const styleId = 'math-inline-simple-question-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .response-editor {
        display: flex;
        justify-content: center;
        width: auto;
        max-width: fit-content;
        height: auto;
        text-align: left;
        padding: 8px;
      }
      .response-editor.mq-math-mode {
        border: 1px solid ${color.primaryLight()};
      }
    `;
    document.head.appendChild(style);
  }
}

export class SimpleQuestionBlock extends React.Component {
  static propTypes = {
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
    const { model, showCorrect, session, emptyResponse,onSimpleResponseChange, showKeypad } = this.props;
    const { config, disabled, correctness } = model || {};

    if (!config) {
      return;
    }

    const correct = correctness && correctness.correct;
    const { responses, equationEditor } = config;

    return (
      <Expression data-keypad={true}>
        {showCorrect || disabled ? (
          <Static
            isIncorrect={!emptyResponse && !correct && !showCorrect}
            isCorrect={!emptyResponse && (correct || showCorrect)}
          >
            <mq.Static
              latex={showCorrect ? responses && responses.length && responses[0].answer : session.response || ''}
            />
          </Static>
        ) : (
          <div id={this.mathToolBarId}>
            <MathToolbar
              classNames={{ editor: 'response-editor' }}
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
      </Expression>
    );
  }
}

export default SimpleQuestionBlock;
