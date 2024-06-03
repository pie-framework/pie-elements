import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { mq, HorizontalKeypad, updateSpans } from '@pie-lib/pie-toolbox/math-input';
import { Collapsible, Readable, hasText, PreviewPrompt } from '@pie-lib/pie-toolbox/render-ui';
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering-accessible';
import MathQuill from '@pie-framework/mathquill';
import { color } from '@pie-lib/pie-toolbox/render-ui';
import { Customizable } from '@pie-lib/pie-toolbox/mask-markup';
import { CorrectAnswerToggle } from '@pie-lib/pie-toolbox/correct-answer-toggle';

let registered = false;

// Define a regex pattern to match {{number}}
const REGEX = /(\{\{\d+\}\})/gm;
const DEFAULT_KEYPAD_VARIANT = 6;

// !!! If you're using Chrome but have selected the "iPad" device in Chrome Developer Tools, the navigator.userAgent string may still report as
//  Safari because Chrome on iOS actually uses the Safari rendering engine under the hood due to Apple's restrictions on third-party browser engines.
// When you select the "iPad" device in Chrome Developer Tools, you're essentially emulating the behavior of Safari on an iPad, including the user agent string.
//  Therefore, even though you're using Chrome, the user agent string will resemble that of Safari on an iPad.
// Since the regular expression /^((?!chrome|android).)*safari/i checks for the presence of "safari" in the user agent string while excluding "chrome" and "android",
//  it will return true in this case because "safari" is present in the user agent string emulated by Chrome when in iPad mode.
const IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

function generateAdditionalKeys(keyData = []) {
  return keyData.map((key) => ({
    name: key,
    latex: key,
    write: key,
    label: key,
  }));
}

function getKeyPadWidth(additionalKeys = [], equationEditor) {
  return Math.floor(additionalKeys.length / 5) * 30 + (equationEditor === 'miscellaneous' ? 600 : 500);
}

function splitByParts(text) {
  // Use the regex pattern to split the text
  const parts = text.split(REGEX);
  // Filter out empty strings that might result from splitting
  return parts.filter(part => part);
}

function prepareForStatic(model, state) {
  const { responses, disabled, markup, printMode, alwaysShowCorrect } = model || {};

  if (markup) {
    if (state.showCorrect) {
      return Object.keys(responses || {}).reduce((acc, responseKey) => {
        acc[responseKey] = responses?.[responseKey]?.answer;

        return acc;
      }, {});
    }

    const splitted = splitByParts(markup);


    return splitted.reduce((acc, split) => {
      if (split.match(REGEX)) {
        const responseKey = Main.getResponseKey(split);
        const answer = state.session.answers[`r${responseKey}`];

        if (printMode && !alwaysShowCorrect) {
          const blankSpace = '\\ \\ '.repeat(30) + '\\embed{newLine}[] ';

          return {
            ...acc,
            [responseKey]: `\\MathQuillMathField[r${responseKey}]{${blankSpace.repeat(3)}}`
          };
        }

        if (disabled) {
          return {
            ...acc,
            [responseKey]: `\\embed{answerBlock}[r${responseKey}]`
          };
        }

        return {
          ...acc,
          [responseKey]: `\\MathQuillMathField[r${responseKey}]{${(answer && answer.value) || ''}}`
        };

      }

      return acc;
    }, {});
  }
}

export class Main extends React.Component {
  // removes {{ and }} and returns only key response. Eg: {{0}} => 0
  static getResponseKey = response => (response || '').replaceAll('{{', '').replaceAll('}}', '');

  static propTypes = {
    classes: PropTypes.object,
    session: PropTypes.object.isRequired,
    onSessionChange: PropTypes.func,
    model: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    const answers = {};
    const { model, session } = props || {};
    const { markup, alwaysShowCorrect } = model || {};
    const { answers: sessionAnswers } = session || {};

    if (markup) {
      // build out local state model using responses declared in markup
      (markup || '').replace(REGEX, (response) => {
        const responseKey = Main.getResponseKey(response);
        const sessionAnswerForResponse = sessionAnswers && sessionAnswers[`r${responseKey}`];

        answers[`r${responseKey}`] = { value: (sessionAnswerForResponse?.value) || '' };
      });
    }

    this.state = {
      session: { ...props.session, answers },
      activeAnswerBlock: '',
      showCorrect: alwaysShowCorrect || false,
    };
  }

  UNSAFE_componentWillMount() {
    const { classes } = this.props;

    if (typeof window !== 'undefined') {
      let MQ = MathQuill.getInterface(2);

      if (!registered) {
        MQ.registerEmbed('answerBlock', (data) => ({
          htmlString: `<div class="${classes.blockContainer}">
              <div class="${classes.blockResponse}" id="${data}Index">R</div>
              <div class="${classes.blockMath}">
                <span id="${data}"></span>
              </div>
            </div>`,
          text: () => 'text',
          latex: () => `\\embed{answerBlock}[${data}]`,
        }));

        registered = true;
      }
    }
  }

  handleAnswerBlockDomUpdate = () => {
    const { model, classes } = this.props;
    const { session, showCorrect } = this.state;
    const answers = session.answers;

    if (this.root && model.disabled && !showCorrect) {
      Object.keys(answers).forEach((answerId) => {
        const el = this.root.querySelector(`#${answerId}`);
        const indexEl = this.root.querySelector(`#${answerId}Index`);

        if (el) {
          let MQ = MathQuill.getInterface(2);
          const answer = answers[answerId];

          el.textContent = (answer && answer.value) || '';

          if (model.view) {
            el.parentElement.parentElement.classList.remove(classes.correct);
            el.parentElement.parentElement.classList.remove(classes.incorrect);
          }

          MQ.StaticMath(el);

          indexEl.textContent = 'R';
        }
      });
    }

    renderMath(this.root);
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { markup } = this.props.model;
    const { markup: nextMarkup } = nextProps.model || {};

    const matches = markup.match(REGEX);
    const nextMatches = nextMarkup.match(REGEX);

    // If markup changed, and we no longer have the same response area, the session needs to be updated
    if (!isEqual(matches, nextMatches)) {
      const newAnswers = {};
      const answers = this.state.session.answers;

      (nextMatches || []).forEach(nextMatch => {
        const responseKey = Main.getResponseKey(nextMatch);
        const sessionAnswerForResponse = answers && answers[`r${responseKey}`];

        // build out local state model using responses declared in markup
        newAnswers[`r${responseKey}`] = { value: (sessionAnswerForResponse?.value) || '' };

      });

      this.setState(
        (state) => ({
          session: {
            ...state.session,
            answers: newAnswers,
          },
        }),
        () => {
          this.props.onSessionChange(this.state.session);
          this.handleAnswerBlockDomUpdate();
        },
      );
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const sameModel = isEqual(this.props.model, nextProps.model);
    const sameState = isEqual(this.state, nextState);

    return !sameModel || !sameState;
  }

  componentDidMount() {
    this.handleAnswerBlockDomUpdate();
    setTimeout(() => renderMath(this.root), 100);
  }

  componentDidUpdate() {
    this.handleAnswerBlockDomUpdate();
  }

  onSubFieldFocus = (id) => {
    this.setState({ activeAnswerBlock: id });
  };

  toNodeData = (data) => {
    if (!data) {
      return;
    }

    const { type, value } = data;

    if (type === 'command' || type === 'cursor') return data;

    if (type === 'answer') return { type: 'answer', ...data };

    if (value === 'clear') return { type: 'clear' };

    return { type: 'write', value };
  };

  setInput = (input) => {
    this.input = input;
  };

  onClick = (data) => {
    const c = this.toNodeData(data);

    if (c.type === 'clear') {
      this.input.clear();
    } else if (c.type === 'command') {
      if (Array.isArray(c.value)) {
        c.value.forEach((vv) => {
          this.input.cmd(vv);
        });
      } else {
        this.input.cmd(c.value);
      }
    } else if (c.type === 'cursor') {
      this.input.keystroke(c.value);
    } else {
      this.input.write(c.value);
    }

    this.input.focus();
  };

  callOnSessionChange = () => {
    const { onSessionChange } = this.props;

    if (onSessionChange) {
      onSessionChange(this.state.session);
    }
  };

  toggleShowCorrect = (show) => {
    this.setState({ showCorrect: show }, this.handleAnswerBlockDomUpdate);
  };

  subFieldChanged = (name, subfieldValue) => {
    updateSpans();

    if (name) {
      this.setState(
        (state) => ({
          session: {
            ...state.session,
            answers: {
              ...state.session.answers,
              [name]: { value: subfieldValue },
            },
          },
        }),
        this.callOnSessionChange,
      );
    }
  };

  getFieldName = (changeField, fields) => {
    const { answers } = this.state.session;

    if (Object.keys(answers || {}).length) {
      const keys = Object.keys(answers);

      return keys.find((k) => {
        const tf = fields[k];

        return tf && tf.id == changeField.id;
      });
    }
  };

  onBlur = (e) => {
    const { relatedTarget, currentTarget } = e || {};

    function getParentWithRoleTooltip(element, depth = 0) {
      // only run this max 16 times
      if (!element || depth >= 16) return null;

      const parent = element.offsetParent;

      if (!parent) return null;

      if (parent.getAttribute('role') === 'tooltip') {
        return parent;
      }

      return getParentWithRoleTooltip(parent, depth + 1);
    }

    function getDeepChildDataKeypad(element, depth = 0) {
      // only run this max 4 times
      if (!element || depth >= 4) return null;

      const child = element?.children?.[0];

      if (!child) return null;

      if (child.attributes && child.attributes['data-keypad']) {
        return child;
      }

      return getDeepChildDataKeypad(child, depth + 1);
    }

    const parentWithTooltipRole = getParentWithRoleTooltip(relatedTarget);
    const childWithDataKeypad = parentWithTooltipRole ? getDeepChildDataKeypad(parentWithTooltipRole) : null;

    if (!relatedTarget || !currentTarget || !childWithDataKeypad?.attributes['data-keypad']) {
      this.setState({ activeAnswerBlock: '' });
    }
  };

  // function for tooltip
  setTooltipRef(ref) {
    // Safari Hack: https://stackoverflow.com/a/42764495/5757635
    setTimeout(() => {
      if (ref && IS_SAFARI) {
        const div = document.querySelector('[role=\'tooltip\']');

        if (div) {
          const el = div.firstChild;
          el.setAttribute('tabindex', '-1');
        }
      }
    }, 1);
  }

  renderTeacherInstructions = () => {
    const { model, classes } = this.props;
    const { teacherInstructions, animationsDisabled } = model || {};

    const teacherInstructionsDiv = (
      <PreviewPrompt defaultClassName="teacher-instructions" prompt={teacherInstructions}/>
    );

    return teacherInstructions && hasText(teacherInstructions) && (
      <div className={classes.collapsible}>
        {!animationsDisabled ? (
          <Collapsible labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}>
            {teacherInstructionsDiv}
          </Collapsible>
        ) : (
          teacherInstructionsDiv
        )}
      </div>
    );
  };

  renderRationale = () => {
    const { model, classes } = this.props;
    const { rationale, animationsDisabled } = model || {};
    const rationaleDiv = <PreviewPrompt prompt={rationale}/>;

    return rationale && hasText(rationale) && (
      <div className={classes.collapsible}>
        {!animationsDisabled ? (
          <Collapsible
            labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}>{rationaleDiv}</Collapsible>
        ) : (
          rationaleDiv
        )}
      </div>
    );
  }

  renderPlayerContent = () => {
    const { model, classes } = this.props;
    const { activeAnswerBlock, showCorrect, session } = this.state;
    const {
      correctness,
      disabled,
      view,
      responses,
      equationEditor,
      customKeys,
      feedback,
      env: { mode } = {},
      printMode,
      alwaysShowCorrect,
    } = model || {};

    const emptyResponse = isEmpty(responses);
    const additionalKeys = generateAdditionalKeys(customKeys);
    const statics = prepareForStatic(model, this.state) || '';
    const studentPrintMode = printMode && !alwaysShowCorrect;

    return (<div className={classes.inputAndKeypadContainer}>
      <Customizable
        disabled={disabled}
        markup={model.markup}
        // TODO remove the need of value?
        value={{}}
        customMarkMarkupComponent={(id) => {
          const responseIsCorrect = mode === 'evaluate' && feedback[id];

          const MQStatic = <mq.Static
            className={classes.static}
            ref={(mqStatic) => {
              this.mqStatic = mqStatic || this.mqStatic;
            }}
            latex={statics[id]}
            onSubFieldChange={this.subFieldChanged}
            getFieldName={this.getFieldName}
            setInput={this.setInput}
            onSubFieldFocus={this.onSubFieldFocus}
            onBlur={this.onBlur}
          />;

          return (
            <div
              className={cx(classes.expression, {
                [classes.incorrect]: !emptyResponse && !responseIsCorrect && !showCorrect,
                [classes.correct]: !emptyResponse && (responseIsCorrect || showCorrect),
                [classes.showCorrectness]: !emptyResponse && disabled && correctness && !view,
                [classes.correctAnswerShown]: showCorrect,
              })}
            >
              <Tooltip
                ref={(ref) => this.setTooltipRef(ref)}
                enterTouchDelay={0}
                interactive
                open={activeAnswerBlock === `r${id}`}
                classes={{ tooltip: classes.keypadTooltip, popper: classes.keypadTooltipPopper }}
                title={Object.keys(session.answers).map(
                  (answerId) =>
                    (answerId === activeAnswerBlock && !(showCorrect || disabled) && (
                      <div
                        data-keypad={true}
                        key={answerId}
                        className={classes.responseContainer}
                        style={{ width: getKeyPadWidth(additionalKeys, equationEditor) }}
                      >
                        <HorizontalKeypad
                          additionalKeys={additionalKeys}
                          mode={equationEditor || DEFAULT_KEYPAD_VARIANT}
                          onClick={this.onClick}
                        />
                      </div>
                    )) ||
                    null,
                )}
              >
                {studentPrintMode
                  ? (<div className={classes.printContainer}>
                    {MQStatic}
                  </div>)
                  : MQStatic}
              </Tooltip>
            </div>
          )
        }}
      />
    </div>);
  }

  render() {
    const { model, classes } = this.props;
    const { showCorrect } = this.state;
    const {
      prompt,
      env: { mode, role } = {},
      correctness,
      responses,
      language,
      showNote,
      note,
    } = model || {};
    const emptyResponse = isEmpty(responses);
    const showCorrectAnswerToggle = !emptyResponse && correctness && correctness.correctness !== 'correct';
    const displayNote = (showCorrect || (mode === 'view' && role === 'instructor')) && showNote && note;

    return (
      <div className={classes.mainContainer} ref={(r) => (this.root = r || this.root)}>
        <div className={classes.main}>
          {/* what is srOnly ? */}
          {mode === 'gather' && <h2 className={classes.srOnly}>Math Equation Response Question</h2>}

          <div className={classes.main}>
            {showCorrectAnswerToggle && (
              <CorrectAnswerToggle
                language={language}
                className={classes.toggle}
                show
                toggled={showCorrect}
                onToggle={this.toggleShowCorrect}
              />
            )}
          </div>

          {this.renderTeacherInstructions()}

          {prompt && (
            <div className={classes.promptContainer}>
              <PreviewPrompt prompt={prompt}/>
            </div>
          )}

          <Readable false>
            {this.renderPlayerContent()}
          </Readable>

          {displayNote && (
            <div
              className={cx(classes.note, 'note')}
              dangerouslySetInnerHTML={{ __html: note }}
            />
          )}

          {this.renderRationale()}
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  mainContainer: {
    color: color.text(),
    backgroundColor: color.background(),
    display: 'inline-block',
  },
  tooltip: {
    background: `${color.primaryLight()} !important`,
    color: color.text(),
    padding: theme.spacing.unit * 2,
    border: `1px solid ${color.secondary()}`,
    fontSize: '16px',
    '& :not(.MathJax) > table tr': {
      '&:nth-child(2n)': {
        backgroundColor: 'unset !important',
      },
    },
  },
  tooltipPopper: {
    opacity: 1,
  },
  keypadTooltip: {
    fontSize: 'initial',
    background: 'transparent',
    width: '600px',
    marginTop: 0,
    paddingTop: 0,
  },
  keypadTooltipPopper: {
    background: 'transparent',
    width: '650px',
    opacity: 1,
  },
  promptContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  main: {
    width: '100%',
    position: 'relative',
    backgroundColor: color.background(),
    color: color.text(),
  },
  title: {
    fontSize: '1.1rem',
    display: 'block',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
  },
  collapsible: {
    marginBottom: theme.spacing.unit * 2,
  },
  responseContainer: {
    zIndex: 10,
    minWidth: '400px',
    marginTop: theme.spacing.unit * 2,
  },
  expression: {
    maxWidth: 'fit-content',
    '& > .mq-math-mode': {
      '& > .mq-root-block': {
        '& > .mq-editable-field': {
          minWidth: '10px',
          margin: (theme.spacing.unit * 2) / 3,
          padding: theme.spacing.unit / 4,
        },
      },
      '& sup': {
        top: 0,
      },
    },
  },
  static: {
    '& > .mq-root-block': {
      '& > .mq-editable-field': {
        borderColor: color.text(),
      },
    },
  },
  inputAndKeypadContainer: {
    position: 'relative',
    '& > div > div': {
      display: 'flex',
      alignItems: 'baseline',
      flexWrap: 'wrap'
    },
    '& .mq-overarrow-inner': {
      border: 'none !important',
      padding: '0 !important',
    },
    '& .mq-overarrow-inner-right': {
      display: 'none !important',
    },
    '& .mq-overarrow-inner-left': {
      display: 'none !important',
    },
    '& .mq-overarrow.mq-arrow-both': {
      minWidth: '1.23em',
      '& *': {
        lineHeight: '1 !important',
      },
      '&:before': {
        top: '-0.4em',
        left: '-1px',
      },
      '&:after': {
        top: '-2.4em',
        right: '-1px',
      },
      '&.mq-empty:after': {
        top: '-0.45em',
      },
    },
    '& .mq-overarrow.mq-arrow-right': {
      '&:before': {
        top: '-0.4em',
        right: '-1px',
      },
    },
    '& .mq-longdiv-inner': {
      borderTop: '1px solid !important',
      paddingTop: '1.5px !important',
    },
    '& .mq-parallelogram': {
      lineHeight: 0.85,
    },
  },
  showCorrectness: {
    border: '2px solid',
  },
  correctAnswerShown: {
    padding: theme.spacing.unit,
    letterSpacing: '0.5px',
  },
  correct: {
    borderColor: `${color.correct()} !important`,
  },
  incorrect: {
    borderColor: `${color.incorrect()} !important`,
  },
  blockContainer: {
    margin: `${theme.spacing.unit}px !important`,
    display: 'inline-flex',
    border: '2px solid grey !important',
  },
  blockResponse: {
    flex: 2,
    color: 'grey',
    background: theme.palette.grey['A100'],
    fontSize: '0.8rem !important',
    padding: `${theme.spacing.unit / 2}px !important`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: `2px solid ${color.disabled()} !important`,
  },
  toggle: {
    color: color.text(),
    marginBottom: theme.spacing.unit * 2,
  },
  blockMath: {
    color: color.text(),
    backgroundColor: color.background(),
    padding: `${theme.spacing.unit / 2}px !important`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 8,
    '& > .mq-math-mode': {
      '& > .mq-hasCursor': {
        '& > .mq-cursor': {
          display: 'none',
        },
      },
    },
  },
  printContainer: {
    marginBottom: theme.spacing.unit,
    pointerEvents: 'none',
  },
  srOnly: {
    position: 'absolute',
    left: '-10000px',
    top: 'auto',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
  },
  note: {
    marginBottom: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(Main);
