import React from 'react';
import PropTypes from 'prop-types';
import { CorrectAnswerToggle } from '@pie-lib/pie-toolbox/correct-answer-toggle';
import { mq, HorizontalKeypad, updateSpans } from '@pie-lib/pie-toolbox/math-input';
import { Feedback, Collapsible, Readable, hasText, PreviewPrompt } from '@pie-lib/pie-toolbox/render-ui';
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering-accessible';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { ResponseTypes } from './utils';
import isEqual from 'lodash/isEqual';
import cx from 'classnames';
import SimpleQuestionBlock from './simple-question-block';
import MathQuill from '@pie-framework/mathquill';
import { color } from '@pie-lib/pie-toolbox/render-ui';
import isEmpty from 'lodash/isEmpty';
import Translator from '@pie-lib/pie-toolbox/translator';
const { translator } = Translator;
let registered = false;

const NEWLINE_LATEX = /\\newline/g;
const REGEX = /{{response}}/gm;
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

function prepareForStatic(model, state) {
  const { config, disabled } = model || {};
  const { expression, responses, printMode, alwaysShowCorrect } = config || {};

  if (config && expression) {
    const modelExpression = expression;

    if (state.showCorrect) {
      return responses && responses.length && responses[0].answer;
    }

    let answerBlocks = 1; // assume one at least
    // build out local state model using responses declared in expression

    return (modelExpression || '')
      .replace(REGEX, function () {
        const answer = state.session.answers[`r${answerBlocks}`];

        if (printMode && !alwaysShowCorrect) {
          const blankSpace = '\\ \\ '.repeat(30) + '\\newline ';

          return `\\MathQuillMathField[r${answerBlocks++}]{${blankSpace.repeat(3)}}`;
        }

        if (disabled) {
          return `\\embed{answerBlock}[r${answerBlocks++}]`;
        }

        return `\\MathQuillMathField[r${answerBlocks++}]{${(answer && answer.value) || ''}}`;
      })
      .replace(NEWLINE_LATEX, '\\embed{newLine}[]');
  }
}

export class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    session: PropTypes.object.isRequired,
    onSessionChange: PropTypes.func,
    model: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    const answers = {};

    if (props.model.config && props.model.config.expression) {
      let answerBlocks = 1; // assume one at least
      // build out local state model using responses declared in expression

      (props.model.config.expression || '').replace(REGEX, () => {
        answers[`r${answerBlocks}`] = {
          value:
            (props.session &&
              props.session.answers &&
              props.session.answers[`r${answerBlocks}`] &&
              props.session.answers[`r${answerBlocks}`].value) ||
            '',
        };

        answerBlocks += 1;
      });
    }

    this.state = {
      session: { ...props.session, answers },
      activeAnswerBlock: '',
      showCorrect: this.props.model.config.alwaysShowCorrect || false,
      tooltipContainerRef: React.createRef(),
    };
  }

  UNSAFE_componentWillMount() {
    const { classes } = this.props;

    if (typeof window !== 'undefined') {
      let MQ = MathQuill.getInterface(2);

      if (!registered) {
        MQ.registerEmbed('answerBlock', (data) => {
          return {
            htmlString: `<div class="${classes.blockContainer}">
                <div class="${classes.blockResponse}" id="${data}Index">R</div>
                <div class="${classes.blockMath}">
                  <span id="${data}"></span>
                </div>
              </div>`,
            text: () => 'text',
            latex: () => `\\embed{answerBlock}[${data}]`,
          };
        });

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
        // const correct = model.correctness && model.correctness.correct;

        if (el) {
          let MQ = MathQuill.getInterface(2);
          const answer = answers[answerId];

          el.textContent = (answer && answer.value) || '';

          if (!model.view) {
            // for now, we're not going to be showing individual response correctness
            // TODO re-attach the classes once we are
            // el.parentElement.parentElement.classList.add(
            //   correct ? classes.correct : classes.incorrect
            // );
          } else {
            el.parentElement.parentElement.classList.remove(classes.correct);
            el.parentElement.parentElement.classList.remove(classes.incorrect);
          }

          MQ.StaticMath(el);

          // For now, we're not going to be indexing response blocks
          // TODO go back to indexing once we support individual response correctness
          // indexEl.textContent = `R${idx + 1}`;
          indexEl.textContent = 'R';
        }
      });
    }

    renderMath(this.root);
  };

  countResponseOccurrences(expression) {
    const pattern = /\{\{response\}\}/g;
    const matches = expression?.match(pattern);

    return matches ? matches.length : 0;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { config } = this.props.model;
    const { config: nextConfig = {} } = nextProps.model || {};
    // check if the note is the default one for prev language and change to the default one for new language
    // this check is necessary in order to diferanciate between default and authour defined note
    // and only change between languages for default ones
    if (
      config.note &&
      config.language &&
      config.language !== nextConfig.language &&
      config.note === translator.t('mathInline.primaryCorrectWithAlternates', { lng: config.language })
    ) {
      config.note = translator.t('mathInline.primaryCorrectWithAlternates', { lng: nextConfig.language });
    }

    if ((config.env && config.env.mode !== 'evaluate') || (nextConfig.env && nextConfig.env.mode !== 'evaluate')) {
      this.setState({ ...this.state.session, showCorrect: false });
    }

    if (nextConfig.alwaysShowCorrect) {
      this.setState({ showCorrect: true });
    }

    if (this.countResponseOccurrences(config.expression) < this.countResponseOccurrences(nextConfig.expression)) {
      setTimeout(() => this.updateAria(), 100);
    }

    if (
      (config && config.responses && config.responses.length !== nextConfig.responses.length) ||
      (!config && nextConfig && nextConfig.responses) ||
      (config && nextConfig && config.expression !== nextConfig.expression)
    ) {
      const newAnswers = {};
      const answers = this.state.session.answers;

      let answerBlocks = 1; // assume one at least

      // build out local state model using responses declared in expression
      (nextConfig.expression || '').replace(REGEX, () => {
        newAnswers[`r${answerBlocks}`] = {
          value: (answers && answers[`r${answerBlocks}`] && answers[`r${answerBlocks}`].value) || '',
        };
        answerBlocks++;
      });

      this.setState(
        (state) => ({
          session: {
            ...state.session,
            completeAnswer: this.mqStatic && this.mqStatic.mathField.latex(),
            answers: newAnswers,
          },
        }),
        this.handleAnswerBlockDomUpdate,
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
    this.updateAria();
    setTimeout(() => renderMath(this.root), 100);
  }

  componentDidUpdate(prevProps, prevState) {
    this.handleAnswerBlockDomUpdate();

    const prevResponseType = prevProps.model?.config?.responseType;
    const currentResponseType = this.props.model?.config?.responseType;

    if (prevResponseType !== currentResponseType) {
      this.updateAria();
    }
  }

  updateAria = () => {
    const { classes } = this.props;

    if (this.root) {
      // Update aria-hidden for .mq-selectable elements
      const selectableElements = this.root.querySelectorAll('.mq-selectable');
      selectableElements.forEach((elem) => elem.setAttribute('aria-hidden', 'true'));

      // Update aria-label for textarea elements and add aria-describedby
      const textareaElements = this.root.querySelectorAll('textarea');
      textareaElements.forEach((elem, index) => {
        elem.setAttribute('aria-label', 'Enter answer.');

        // Create a unique id for each instructions element
        const instructionsId = `instructions-${index}`;

        // Find the parent element that contains the textarea
        const parent = elem.closest('.mq-textarea');

        if (parent) {
          // Create or find the instructions element within the parent
          let instructionsElement = parent.querySelector(`#${instructionsId}`);

          if (!instructionsElement) {
            instructionsElement = document.createElement('span');
            instructionsElement.id = instructionsId;
            instructionsElement.className = classes.srOnly;
            instructionsElement.textContent =
              'This field supports both keypad and keyboard input. Use the keyboard to access and interact with the on-screen math keypad, which accepts LaTeX markup. Use the down arrow key to open the keypad and navigate its buttons. Use the escape key to close the keypad and return to the input field.';
            parent.insertBefore(instructionsElement, elem);
          }

          elem.setAttribute('aria-describedby', instructionsId);
        }
      });
    }
  };

  focusFirstKeypadElement = () => {
    setTimeout(() => {
      const keypadElement = document.querySelector('[data-keypad]');

      if (keypadElement) {
        const firstButton = keypadElement.querySelector("button, [role='button']");

        if (firstButton) {
          firstButton.focus();
        }
      }
    }, 0);
  };

  handleKeyDown = (event, id) => {
    const isAnswerInputFocused = document.activeElement.getAttribute('aria-label') === 'Enter answer.';
    const isClickOrTouchEvent = event.type === 'click' || event.type === 'touchstart';

    if (isAnswerInputFocused && (event.key === 'ArrowDown' || isClickOrTouchEvent)) {
      this.setState({ activeAnswerBlock: id }, () => {
        if (event.key === 'ArrowDown') {
          this.focusFirstKeypadElement();
        }
      });
    }

    if ((!isAnswerInputFocused && isClickOrTouchEvent) || event.key === 'Escape') {
      this.setState({ activeAnswerBlock: '' });
    }
  };

  onSubFieldFocus = (id) => {
    const handleEvent = (event) => {
      this.handleKeyDown(event, id);
    };

    document.addEventListener('keydown', handleEvent);
    document.addEventListener('click', handleEvent);
    document.addEventListener('touchstart', handleEvent);
  };

  cleanupKeyDownListener = () => {
    document.removeEventListener('keydown', this.handleEvent);
    document.removeEventListener('click', this.handleEvent);
    document.removeEventListener('touchstart', this.handleEvent);
  };

  componentWillUnmount() {
    if (this.cleanupKeyDownListener) {
      this.cleanupKeyDownListener();
    }
  }

  onDone = () => {};

  onSimpleResponseChange = (response) => {
    this.setState((state) => ({ session: { ...state.session, response } }), this.callOnSessionChange);
  };

  toNodeData = (data) => {
    if (!data) {
      return;
    }

    const { type, value } = data;

    if (type === 'command' || type === 'cursor') {
      return data;
    } else if (type === 'answer') {
      return { type: 'answer', ...data };
    } else if (value === 'clear') {
      return { type: 'clear' };
    } else {
      return { type: 'write', value };
    }
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
            completeAnswer: this.mqStatic && this.mqStatic.mathField.latex(),
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
    // else {
    //     // Just for debugging purpose:
    //     console.log('\n\nNew childWithDataKeypad', childWithDataKeypad);
    //
    //     if (IS_SAFARI) {
    //         // (IS_SAFARI && !relatedTarget?.offsetParent?.children[0]?.children[0]?.attributes?.['data-keypad'])
    //         console.log('What was being used', relatedTarget?.offsetParent?.children[0]?.children[0]);
    //     } else {
    //         // (!IS_SAFARI && !relatedTarget?.offsetParent?.children[0]?.attributes?.['data-keypad']) ||
    //         console.log('What was being used', relatedTarget?.offsetParent?.children[0]);
    //     }
    // }
  };

  setTooltipRef(ref) {
    // Safari Hack: https://stackoverflow.com/a/42764495/5757635
    setTimeout(() => {
      if (ref && IS_SAFARI) {
        const div = document.querySelector("[role='tooltip']");

        if (div) {
          const el = div.firstChild;
          el.setAttribute('tabindex', '-1');
        }
      }
    }, 1);
  }

  render() {
    const { model, classes } = this.props;
    const { activeAnswerBlock, showCorrect, session, tooltipContainerRef } = this.state;
    const {
      config,
      correctness,
      disabled,
      view,
      teacherInstructions,
      rationale,
      feedback,
      animationsDisabled,
      printMode,
      alwaysShowCorrect,
      language,
    } = model || {};

    if (!config) {
      return null;
    }

    const {
      showNote,
      note,
      prompt,
      responses,
      responseType,
      equationEditor,
      customKeys,
      env: { mode, role } = {},
    } = config || {};
    const displayNote = (showCorrect || (mode === 'view' && role === 'instructor')) && showNote && note;
    const emptyResponse = isEmpty(responses);
    const showCorrectAnswerToggle = !emptyResponse && correctness && correctness.correctness !== 'correct';
    const tooltipModeEnabled = disabled && correctness;
    const additionalKeys = generateAdditionalKeys(customKeys);
    const correct = correctness && correctness.correct;
    const staticLatex = prepareForStatic(model, this.state) || '';
    const viewMode = disabled && !correctness;
    const studentPrintMode = printMode && !alwaysShowCorrect;

    const printView = (
      <div className={classes.printContainer}>
        <mq.Static
          className={classes.static}
          ref={(mqStatic) => (this.mqStatic = mqStatic || this.mqStatic)}
          latex={staticLatex}
          onSubFieldChange={this.subFieldChanged}
          getFieldName={this.getFieldName}
          setInput={this.setInput}
          onSubFieldFocus={this.onSubFieldFocus}
          onBlur={this.onBlur}
        />
      </div>
    );

    const midContent = (
      <div className={classes.main}>
        {mode === 'gather' && <h2 className={classes.srOnly}>Math Equation Response Question</h2>}

        {viewMode &&
          teacherInstructions &&
          hasText(teacherInstructions) &&
          (!animationsDisabled ? (
            <Collapsible
              className={classes.collapsible}
              labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}
            >
              <div dangerouslySetInnerHTML={{ __html: teacherInstructions }} />
            </Collapsible>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: teacherInstructions }} />
          ))}

        {prompt && (
          <div className={classes.promptContainer}>
            <PreviewPrompt prompt={prompt} />
          </div>
        )}

        {studentPrintMode ? (
          printView
        ) : (
          <Readable false>
            <div className={classes.inputAndKeypadContainer} tabIndex={0}>
              {responseType === ResponseTypes.simple && (
                <SimpleQuestionBlock
                  onSimpleResponseChange={this.onSimpleResponseChange}
                  showCorrect={showCorrect}
                  emptyResponse={emptyResponse}
                  model={model}
                  session={session}
                  onSubFieldFocus={this.onSubFieldFocus}
                  showKeypad={!!activeAnswerBlock}
                />
              )}

              {responseType === ResponseTypes.advanced && (
                <div
                  ref={tooltipContainerRef}
                  className={cx(classes.expression, {
                    [classes.incorrect]: !emptyResponse && !correct && !showCorrect,
                    [classes.correct]: !emptyResponse && (correct || showCorrect),
                    [classes.showCorrectness]: !emptyResponse && disabled && correctness && !view,
                    [classes.correctAnswerShown]: showCorrect,
                    [classes.printCorrect]: printMode && alwaysShowCorrect,
                  })}
                >
                  <Tooltip
                    ref={(ref) => this.setTooltipRef(ref)}
                    enterTouchDelay={0}
                    interactive
                    open={!!activeAnswerBlock}
                    classes={{
                      tooltip: classes.keypadTooltip,
                      popper: classes.keypadTooltipPopper,
                    }}
                    PopperProps={{
                      container: tooltipContainerRef?.current || undefined,
                      placement: 'bottom-start',
                      modifiers: {
                        preventOverflow: {
                          enabled: true,
                          boundariesElement: 'body',
                        },
                        flip: {
                          enabled: true,
                        },
                      },
                    }}
                    title={Object.keys(session.answers).map(
                      (answerId) =>
                        (answerId === activeAnswerBlock && !(showCorrect || disabled) && (
                          <div
                            data-keypad={true}
                            key={answerId}
                            className={classes.responseContainer}
                            style={{
                              // marginTop: this.mqStatic && this.mqStatic.input.offsetHeight - 20,
                              width: getKeyPadWidth(additionalKeys, equationEditor),
                            }}
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
                    <mq.Static
                      className={classes.static}
                      ref={(mqStatic) => (this.mqStatic = mqStatic || this.mqStatic)}
                      latex={staticLatex}
                      onSubFieldChange={this.subFieldChanged}
                      getFieldName={this.getFieldName}
                      setInput={this.setInput}
                      onSubFieldFocus={this.onSubFieldFocus}
                      onBlur={this.onBlur}
                    />
                  </Tooltip>
                </div>
              )}
            </div>
          </Readable>
        )}

        {viewMode && displayNote && (
          <div className={classes.note} dangerouslySetInnerHTML={{ __html: `<strong>Note:</strong> ${note}` }} />
        )}

        {viewMode &&
          rationale &&
          hasText(rationale) &&
          (!animationsDisabled ? (
            <Collapsible labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}>
              <div dangerouslySetInnerHTML={{ __html: rationale }} />
            </Collapsible>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: rationale }} />
          ))}
      </div>
    );

    if (
      tooltipModeEnabled &&
      (showCorrectAnswerToggle ||
        (teacherInstructions && hasText(teacherInstructions)) ||
        (rationale && hasText(rationale)) ||
        feedback)
    ) {
      return (
        <Tooltip
          interactive
          enterTouchDelay={0}
          classes={{
            tooltip: classes.tooltip,
            popper: classes.tooltipPopper,
          }}
          title={
            <div>
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

              {teacherInstructions && hasText(teacherInstructions) && (
                <Collapsible
                  className={classes.collapsible}
                  key="collapsible-teacher-instructions"
                  labels={{
                    hidden: 'Show Teacher Instructions',
                    visible: 'Hide Teacher Instructions',
                  }}
                >
                  <PreviewPrompt prompt={teacherInstructions} />
                </Collapsible>
              )}
              {displayNote && hasText(note) && (
                <Collapsible
                  className={classes.collapsible}
                  key="collapsible-note"
                  labels={{
                    hidden: translator.t('common:showNote', { lng: language }),
                    visible: translator.t('common:hideNote', { lng: language }),
                  }}
                >
                  <PreviewPrompt prompt={note} />
                </Collapsible>
              )}

              {rationale && hasText(rationale) && (
                <Collapsible
                  className={classes.collapsible}
                  key="collapsible-rationale"
                  labels={{
                    hidden: 'Show Rationale',
                    visible: 'Hide Rationale',
                  }}
                >
                  <PreviewPrompt prompt={rationale} />
                </Collapsible>
              )}

              {feedback && <Feedback correctness={correctness.correctness} feedback={feedback} />}
            </div>
          }
        >
          <div className={classes.mainContainer} ref={(r) => (this.root = r || this.root)}>
            {midContent}
          </div>
        </Tooltip>
      );
    }

    return (
      <div className={classes.mainContainer} ref={(r) => (this.root = r || this.root)}>
        {midContent}
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
  note: {
    paddingBottom: theme.spacing.unit * 2,
  },
  collapsible: {
    marginBottom: theme.spacing.unit * 2,
  },
  responseContainer: {
    zIndex: 10,
    // position: 'absolute',
    // right: 0,
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
  printCorrect: {
    border: `2px solid ${color.correct()} !important`,
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
    color: 'grey',
    background: theme.palette.grey['A100'],
    fontSize: '0.8rem !important',
    padding: `${theme.spacing.unit / 2}px !important`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: `2px solid ${color.disabled()} !important`,
    flexShrink: 0,
    flexGrow: 0,
    flexBasis: 'auto', // take only the space needed for content + padding
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
    flexGrow: 1, // take all the remaining space
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
});

export default withStyles(styles)(Main);
