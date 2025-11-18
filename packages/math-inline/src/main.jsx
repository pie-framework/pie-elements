import React from 'react';
import PropTypes from 'prop-types';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import { mq, HorizontalKeypad, updateSpans } from '@pie-lib/math-input';
import { Feedback, Collapsible, Readable, hasText, hasMedia, PreviewPrompt, UiLayout } from '@pie-lib/render-ui';
import { renderMath } from '@pie-lib/math-rendering';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { ResponseTypes } from './utils';
import isEqual from 'lodash/isEqual';
import cx from 'classnames';
import SimpleQuestionBlock from './simple-question-block';
import MathQuill from '@pie-framework/mathquill';
import { color } from '@pie-lib/render-ui';
import isEmpty from 'lodash/isEmpty';
import Translator from '@pie-lib/translator';
import ReactDOM from 'react-dom';
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

function isChildOfCurrentPieElement(child, parent) {
  let node = child;
  while (node !== null) {
    if (parent && node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
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

function parseAnswers(session, model) {
  const answers = {};

  if (model.config && model.config.expression) {
    let answerBlocks = 1; // assume one at least
    // build out local state model using responses declared in expression

    (model.config.expression || '').replace(REGEX, () => {
      answers[`r${answerBlocks}`] = {
        value:
          (session &&
            session.answers &&
            session.answers[`r${answerBlocks}`] &&
            session.answers[`r${answerBlocks}`].value) ||
          '',
      };

      answerBlocks += 1;
    });
  }
  return answers;
}

export class Main extends React.Component {
  static propTypes = {
    session: PropTypes.object.isRequired,
    onSessionChange: PropTypes.func,
    model: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    const { model, session } = props;
    const answers = parseAnswers(session, model);

    this.state = {
      session: { ...props.session, answers },
      activeAnswerBlock: '',
      showCorrect: this.props.model.config.alwaysShowCorrect || false,
      tooltipContainerRef: React.createRef(),
    };
  }

  UNSAFE_componentWillMount() {
    if (typeof window !== 'undefined') {
      let MQ = MathQuill.getInterface(2);

      if (!registered) {
        MQ.registerEmbed('answerBlock', (data) => {
          const classNames = getBlockClassNames();
          return {
            htmlString: `<div class="${classNames.blockContainer}">
                <div class="${classNames.blockResponse}" id="${data}Index">R</div>
                <div class="${classNames.blockMath}">
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
    const { model } = this.props;
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
            //   correct ? 'correct' : 'incorrect'
            // );
          } else {
            el.parentElement.parentElement.classList.remove('correct');
            el.parentElement.parentElement.classList.remove('incorrect');
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

    const { session } = this.props;
    const { session: nextSession = {} } = nextProps || {};

    // in case session props changed in parent, we need to catch this and update local state
    // example: when env is changing in pieoneer
    if (session && nextSession && !isEqual(session.answers, nextSession.answers)) {
      this.setState({
        session: { ...nextSession, answers: parseAnswers(nextSession, this.props.model) },
      });
    }

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
            instructionsElement.className = 'sr-only';
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
    const isTrigerredFromActualPieElement = isChildOfCurrentPieElement(event.target, this.root);
    const isAnswerInputFocused =
      this.mqStatic && this.mqStatic.inputRef?.current
        ? this.mqStatic.inputRef?.current.contains(document.activeElement)
        : document.activeElement?.getAttribute('aria-label') === 'Enter answer.';
    const { key, type } = event;
    const isClickOrTouchEvent = type === 'click' || type === 'touchstart';

    if (isAnswerInputFocused && (key === 'ArrowDown' || isClickOrTouchEvent)) {
      if (this.state.activeAnswerBlock !== id && isTrigerredFromActualPieElement) {
        this.cleanupKeyDownListener();
        this.setState({ activeAnswerBlock: id }, () => {
          this.onSubFieldFocus(id);
          if (key === 'ArrowDown') {
            this.focusFirstKeypadElement();
          }
        });
      }
    } else if (event.key === 'Escape') {
      this.setState({ activeAnswerBlock: '' });
    }
  };

  onSubFieldFocus = (id) => {
    if (!this.handleEvent) {
      this.handleEvent = (event) => {
        this.handleKeyDown(event, id);
      };

      document.addEventListener('keydown', this.handleEvent);
      document.addEventListener('click', this.handleEvent);
      document.addEventListener('touchstart', this.handleEvent);
    }
  };

  cleanupKeyDownListener = () => {
    if (this.handleEvent) {
      document.removeEventListener('keydown', this.handleEvent);
      document.removeEventListener('click', this.handleEvent);
      document.removeEventListener('touchstart', this.handleEvent);
      this.handleEvent = null;
    }
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

    // our keypad is in tooltip
    // in this way we see if event was triggered from the keypad
    const isKeypadOpen = currentTarget && currentTarget.closest('[role=tooltip]');

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
      // if event was trigered from the keypad, avoid closing the keypad
      if (!isKeypadOpen) {
        this.setState({ activeAnswerBlock: '' });
      }
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
    const { model } = this.props;
    const { activeAnswerBlock, showCorrect, session, tooltipContainerRef } = this.state;
    const {
      config,
      correctness,
      disabled,
      extraCSSRules,
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
      id,
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
    const showRationale = rationale && (hasText(rationale) || hasMedia(rationale));
    const showTeacherInstructions =
      teacherInstructions && (hasText(teacherInstructions) || hasMedia(teacherInstructions));

    const printView = (
      <PrintContainer>
        <mq.Static
          className="static-math"
          ref={(mqStatic) => {
            if (mqStatic) this.mqStatic = mqStatic;
          }}
          latex={staticLatex}
          onSubFieldChange={this.subFieldChanged}
          getFieldName={this.getFieldName}
          setInput={this.setInput}
          onSubFieldFocus={this.onSubFieldFocus}
          onBlur={this.onBlur}
        />
      </PrintContainer>
    );

    const midContent = (
      <MainContent>
        {mode === 'gather' && <SrOnly>Math Equation Response Question</SrOnly>}

        {viewMode &&
          showTeacherInstructions &&
          (!animationsDisabled ? (
            <StyledCollapsible
              labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}
            >
              <div dangerouslySetInnerHTML={{ __html: teacherInstructions }} />
            </StyledCollapsible>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: teacherInstructions }} />
          ))}

        {prompt && (
          <PromptContainer>
            <PreviewPrompt prompt={prompt} />
          </PromptContainer>
        )}

        {studentPrintMode ? (
          printView
        ) : (
          <Readable false>
            <InputAndKeypadContainer tabIndex={0}>
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
                <Expression
                  ref={tooltipContainerRef}
                  isIncorrect={!emptyResponse && !correct && !showCorrect}
                  isCorrect={!emptyResponse && (correct || showCorrect)}
                  showCorrectness={!emptyResponse && disabled && correctness && !view}
                  correctAnswerShown={showCorrect}
                  printCorrect={printMode && alwaysShowCorrect}
                >
                  <KeypadTooltip
                    ref={(ref) => this.setTooltipRef(ref)}
                    enterTouchDelay={0}
                    disablePortal={true}
                    interactive
                    open={!!activeAnswerBlock}
                    slotProps={{
                      popper: {
                        container: tooltipContainerRef?.current || undefined,
                        placement: 'bottom-start',
                        modifiers: {
                          preventOverflow: {
                            enabled: true,
                            boundariesElement: 'body',
                          },
                          flip: {
                            enabled: false,
                          },
                        },
                      },
                    }}
                    title={Object.keys(session.answers).map(
                      (answerId) =>
                        (answerId === activeAnswerBlock && !(showCorrect || disabled) && (
                          <ResponseContainer
                            data-keypad={true}
                            key={answerId}
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
                          </ResponseContainer>
                        )) ||
                        null,
                    )}
                  >
                    <div>
                      <mq.Static
                        className="static-math"
                        ref={(mqStatic) => {
                          if (mqStatic) this.mqStatic = mqStatic;
                        }}
                        latex={staticLatex}
                        onSubFieldChange={this.subFieldChanged}
                        getFieldName={this.getFieldName}
                        setInput={this.setInput}
                        onSubFieldFocus={this.onSubFieldFocus}
                        onBlur={this.onBlur}
                      />
                    </div>
                  </KeypadTooltip>
                </Expression>
              )}
            </InputAndKeypadContainer>
          </Readable>
        )}

        {viewMode && displayNote && (
          <Note dangerouslySetInnerHTML={{ __html: `<strong>Note:</strong> ${note}` }} />
        )}

        {viewMode &&
          showRationale &&
          (!animationsDisabled ? (
            <Collapsible labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}>
              <div dangerouslySetInnerHTML={{ __html: rationale }} />
            </Collapsible>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: rationale }} />
          ))}
      </MainContent>
    );

    if (tooltipModeEnabled && (showCorrectAnswerToggle || showTeacherInstructions || showRationale || feedback)) {
      return (
        <UiLayout extraCSSRules={extraCSSRules}>
          <StyledTooltip
            interactive
            enterTouchDelay={0}
            title={
              <div>
                <MainContent>
                  {showCorrectAnswerToggle && (
                    <StyledCorrectAnswerToggle
                      language={language}
                      show
                      toggled={showCorrect}
                      onToggle={this.toggleShowCorrect}
                    />
                  )}
                </MainContent>

                {showTeacherInstructions && (
                  <StyledCollapsible
                    key="collapsible-teacher-instructions"
                    labels={{
                      hidden: 'Show Teacher Instructions',
                      visible: 'Hide Teacher Instructions',
                    }}
                  >
                    <PreviewPrompt prompt={teacherInstructions} />
                  </StyledCollapsible>
                )}
                {displayNote && hasText(note) && (
                  <StyledCollapsible
                    key="collapsible-note"
                    labels={{
                      hidden: translator.t('common:showNote', { lng: language }),
                      visible: translator.t('common:hideNote', { lng: language }),
                    }}
                  >
                    <PreviewPrompt prompt={note} />
                  </StyledCollapsible>
                )}

                {showRationale && (
                  <StyledCollapsible
                    key="collapsible-rationale"
                    labels={{
                      hidden: 'Show Rationale',
                      visible: 'Hide Rationale',
                    }}
                  >
                    <PreviewPrompt prompt={rationale} />
                  </StyledCollapsible>
                )}

                {feedback && <Feedback correctness={correctness.correctness} feedback={feedback} />}
              </div>
            }
          >
            <MainContainer ref={(r) => (this.root = r || this.root)}>
              {midContent}
            </MainContainer>
          </StyledTooltip>
        </UiLayout>
      );
    }

    return (
      <UiLayout
        id={id}
        extraCSSRules={extraCSSRules}
        ref={(r) => {
          // eslint-disable-next-line react/no-find-dom-node
          const domNode = ReactDOM.findDOMNode(r);

          this.root = domNode || this.root;
        }}
      >
        <MainContainer>
          {midContent}
        </MainContainer>
      </UiLayout>
    );
  }
}

// Helper function to get class names for HTML string generation
const getBlockClassNames = () => {
  return {
    blockContainer: 'block-container',
    blockResponse: 'block-response',
    blockMath: 'block-math',
  };
};

// CSS for block classes used in HTML string generation
if (typeof document !== 'undefined') {
  const styleId = 'math-inline-block-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .block-container {
        margin: 8px !important;
        display: inline-flex;
        border: 2px solid grey !important;
      }
      .block-response {
        color: grey;
        background: #f5f5f5;
        font-size: 0.8rem !important;
        padding: 4px !important;
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 2px solid #bdbdbd !important;
        flex-shrink: 0;
        flex-grow: 0;
        flex-basis: auto;
      }
      .block-math {
        color: ${color.text()};
        background-color: ${color.background()};
        padding: 4px !important;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-grow: 1;
      }
      .block-math > .mq-math-mode > .mq-hasCursor > .mq-cursor {
        display: none;
      }
      .sr-only {
        position: absolute;
        left: -10000px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
      }
      .static-math > .mq-root-block > .mq-editable-field {
        border-color: ${color.text()};
      }
    `;
    document.head.appendChild(style);
  }
}

const MainContainer = styled('div')({
  color: color.text(),
  backgroundColor: color.background(),
  display: 'inline-block',
});

const StyledTooltip = styled(Tooltip)(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    background: `${color.primaryLight()} !important`,
    color: color.text(),
    padding: theme.spacing(2),
    border: `1px solid ${color.secondary()}`,
    fontSize: '16px',
    '& :not(.MathJax) > table tr': {
      '&:nth-child(2n)': {
        backgroundColor: 'unset !important',
      },
    },
  },
  '& .MuiTooltip-popper': {
    opacity: 1,
  },
}));

const KeypadTooltip = styled(Tooltip)({
  '& .MuiTooltip-tooltip': {
    fontSize: 'initial',
    backgroundColor: 'transparent !important',
    width: '600px',
    marginTop: 0,
    paddingTop: 0,
    boxShadow: 'none',
  },
  '& .MuiTooltip-popper': {
    backgroundColor: 'transparent',
    width: '650px',
    opacity: 1,
  },
  '& .MuiTooltip-arrow': {
    display: 'none',
  },
});

const PromptContainer = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const MainContent = styled('div')({
  width: '100%',
  position: 'relative',
  backgroundColor: color.background(),
  color: color.text(),
});

const Title = styled('h2')(({ theme }) => ({
  fontSize: '1.1rem',
  display: 'block',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
}));

const Note = styled('div')(({ theme }) => ({
  paddingBottom: theme.spacing(2),
}));

const StyledCollapsible = styled(Collapsible)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const ResponseContainer = styled('div')(({ theme }) => ({
  zIndex: 10,
  minWidth: '400px',
  marginTop: theme.spacing(2),
}));

const Expression = styled('div', {
  shouldForwardProp: (prop) => !['isIncorrect', 'isCorrect', 'showCorrectness', 'correctAnswerShown', 'printCorrect'].includes(prop),
})(({ theme, isIncorrect, isCorrect, showCorrectness, correctAnswerShown, printCorrect }) => {
  const borderColor = isIncorrect
    ? color.incorrect()
    : isCorrect
      ? color.correct()
      : undefined;

  return {
    maxWidth: 'fit-content',
    padding: theme.spacing(0.25),
    ...(showCorrectness && {
      border: borderColor ? `2px solid ${borderColor} !important` : '2px solid',
    }),
    ...(!showCorrectness && borderColor && {
      borderColor: `${borderColor} !important`,
    }),
    ...(correctAnswerShown && {
      padding: theme.spacing(1),
      letterSpacing: '0.5px',
    }),
    ...(printCorrect && {
      border: `2px solid ${color.correct()} !important`,
    }),
    '& > .mq-math-mode': {
      '& > .mq-root-block': {
        paddingRight: '0 !important',
        paddingLeft: '0 !important',
        '& > .mq-editable-field': {
          minWidth: '10px',
          padding: theme.spacing(0.25),
        },
      },
      '& sup': {
        top: 0,
      },
    },
  };
});

const InputAndKeypadContainer = styled('div')({
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
});

const PrintContainer = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(1),
  pointerEvents: 'none',
}));

const SrOnly = styled('h2')({
  position: 'absolute',
  left: '-10000px',
  top: 'auto',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
});

const StyledCorrectAnswerToggle = styled(CorrectAnswerToggle)(({ theme }) => ({
  color: color.text(),
  marginBottom: theme.spacing(2),
}));

export default Main;
