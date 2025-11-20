import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { mq, HorizontalKeypad, updateSpans } from '@pie-lib/math-input';
import { color, Collapsible, Readable, hasText, hasMedia, PreviewPrompt, UiLayout } from '@pie-lib/render-ui';
import { renderMath } from '@pie-lib/math-rendering';
import MathQuill from '@pie-framework/mathquill';
import { Customizable } from '@pie-lib/mask-markup';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import ReactDOM from 'react-dom';

const StyledUiLayout = styled(UiLayout)({
  color: color.text(),
  backgroundColor: color.background(),
  display: 'inline-block',
});

const MainContainer = styled('div')({
  width: '100%',
  position: 'relative',
  backgroundColor: color.background(),
  color: color.text(),
});

const PromptContainer = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const CollapsibleContainer = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const InputAndKeypadContainer = styled('div')({
  position: 'relative',
  '& > div > div': {
    display: 'flex',
    alignItems: 'baseline',
    flexWrap: 'wrap',
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
});

const Expression = styled('div')(({ theme, $incorrect, $correct, $showCorrectness, $correctAnswerShown }) => ({
  maxWidth: 'fit-content',
  ...($incorrect && {
    borderColor: `${color.incorrect()} !important`,
  }),
  ...($correct && {
    borderColor: `${color.correct()} !important`,
  }),
  ...($showCorrectness && {
    border: '2px solid',
  }),
  ...($correctAnswerShown && {
    padding: theme.spacing(1),
    letterSpacing: '0.5px',
  }),
  '& > .mq-math-mode': {
    '& > .mq-root-block': {
      '& > .mq-editable-field': {
        minWidth: '10px',
        padding: theme.spacing(0.25),
      },
    },
    '& sup': {
      top: 0,
    },
  },
}));

const StyledStatic = styled(mq.Static)({
  '& > .mq-root-block': {
    '& > .mq-editable-field': {
      borderColor: color.text(),
    },
  },
});

// Tooltip styling is handled via slotProps, no need for styled component

const ResponseContainer = styled('div')(({ theme }) => ({
  zIndex: 10,
  minWidth: '400px',
  marginTop: theme.spacing(2),
}));

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

const Note = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledToggle = styled(CorrectAnswerToggle)(({ theme }) => ({
  color: color.text(),
  marginBottom: theme.spacing(2),
}));

// CSS for classes used in HTML strings and classList operations
if (typeof document !== 'undefined') {
  const styleId = 'math-templated-main-styles';
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
        flex: 2;
        color: grey;
        background: rgba(0, 0, 0, 0.04);
        font-size: 0.8rem !important;
        padding: 4px !important;
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 2px solid #bdbdbd !important;
      }
      .block-math {
        color: ${color.text()};
        background-color: ${color.background()};
        padding: 4px !important;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 8;
      }
      .block-math > .mq-math-mode > .mq-hasCursor > .mq-cursor {
        display: none;
      }
      .correct {
        border-color: ${color.correct()} !important;
      }
      .incorrect {
        border-color: ${color.incorrect()} !important;
      }
    `;
    document.head.appendChild(style);
  }
}

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
  return parts.filter((part) => part);
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
            [responseKey]: `\\MathQuillMathField[r${responseKey}]{${blankSpace.repeat(3)}}`,
          };
        }

        if (disabled) {
          return {
            ...acc,
            [responseKey]: `\\embed{answerBlock}[r${responseKey}]`,
          };
        }

        return {
          ...acc,
          [responseKey]: `\\MathQuillMathField[r${responseKey}]{${(answer && answer.value) || ''}}`,
        };
      }

      return acc;
    }, {});
  }
}

export class Main extends React.Component {
  // removes {{ and }} and returns only key response. Eg: {{0}} => 0
  static getResponseKey = (response) => (response || '').replaceAll('{{', '').replaceAll('}}', '');

  static propTypes = {
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

        answers[`r${responseKey}`] = { value: sessionAnswerForResponse?.value || '' };
      });
    }

    this.state = {
      session: { ...props.session, answers },
      activeAnswerBlock: '',
      showCorrect: alwaysShowCorrect || false,
      tooltipContainerRef: React.createRef(),
    };
  }

  UNSAFE_componentWillMount() {
    if (typeof window !== 'undefined') {
      let MQ = MathQuill.getInterface(2);

      if (!registered) {
        MQ.registerEmbed('answerBlock', (data) => ({
          htmlString: `<div class="block-container">
              <div class="block-response" id="${data}Index">R</div>
              <div class="block-math">
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
    const { model } = this.props;
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
            el.parentElement.parentElement.classList.remove('correct');
            el.parentElement.parentElement.classList.remove('incorrect');
          }

          MQ.StaticMath(el);

          indexEl.textContent = 'R';
        }
      });
    }

    renderMath(this.root);
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { model } = this.props;
    const { model: nextModel = {} } = nextProps || {};
    const { markup = '', env = {} } = model || {};
    const { markup: nextMarkup = '', env: nextEnv = {}, alwaysShowCorrect: nextAlwaysShowCorrect = false } = nextModel;

    const isEvaluateMode = (env) => env && env.mode === 'evaluate';

    if (!isEvaluateMode(env) || !isEvaluateMode(nextEnv)) {
      this.setState((prevState) => ({ ...prevState.session, showCorrect: false }));
    }

    if (nextAlwaysShowCorrect) {
      this.setState({ showCorrect: true });
    }

    const matches = markup.match(REGEX);
    const nextMatches = nextMarkup.match(REGEX);

    // If markup changed, and we no longer have the same response area, the session needs to be updated
    if (!isEqual(matches, nextMatches)) {
      const newAnswers = {};
      const answers = this.state.session.answers;

      (nextMatches || []).forEach((nextMatch) => {
        const responseKey = Main.getResponseKey(nextMatch);
        const sessionAnswerForResponse = answers && answers[`r${responseKey}`];

        // build out local state model using responses declared in markup
        newAnswers[`r${responseKey}`] = { value: sessionAnswerForResponse?.value || '' };
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
        const div = document.querySelector("[role='tooltip']");

        if (div) {
          const el = div.firstChild;
          el.setAttribute('tabindex', '-1');
        }
      }
    }, 1);
  }

  renderTeacherInstructions = () => {
    const { model } = this.props;
    const { teacherInstructions, animationsDisabled } = model || {};
    const showTeacherInstructions =
      teacherInstructions && (hasText(teacherInstructions) || hasMedia(teacherInstructions));

    const teacherInstructionsDiv = (
      <PreviewPrompt defaultClassName="teacher-instructions" prompt={teacherInstructions} />
    );

    return (
      showTeacherInstructions && (
        <CollapsibleContainer>
          {!animationsDisabled ? (
            <Collapsible labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}>
              {teacherInstructionsDiv}
            </Collapsible>
          ) : (
            teacherInstructionsDiv
          )}
        </CollapsibleContainer>
      )
    );
  };

  renderRationale = () => {
    const { model } = this.props;
    const { rationale, animationsDisabled } = model || {};
    const rationaleDiv = <PreviewPrompt prompt={rationale} />;
    const showRationale = rationale && (hasText(rationale) || hasMedia(rationale));

    return (
      showRationale && (
        <CollapsibleContainer>
          {!animationsDisabled ? (
            <Collapsible labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}>{rationaleDiv}</Collapsible>
          ) : (
            rationaleDiv
          )}
        </CollapsibleContainer>
      )
    );
  };

  renderPlayerContent = () => {
    const { model } = this.props;
    const { activeAnswerBlock, showCorrect, session, tooltipContainerRef } = this.state;
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

    return (
      <InputAndKeypadContainer>
        <Customizable
          disabled={disabled}
          markup={model.markup}
          // TODO remove the need of value?
          value={{}}
          customMarkMarkupComponent={(id) => {
            const responseIsCorrect = mode === 'evaluate' && feedback && feedback[id];

            const MQStatic = (
              <StyledStatic
                ref={(mqStatic) => {
                  this.mqStatic = mqStatic || this.mqStatic;
                }}
                latex={statics[id]}
                onSubFieldChange={this.subFieldChanged}
                getFieldName={this.getFieldName}
                setInput={this.setInput}
                onSubFieldFocus={this.onSubFieldFocus}
                onBlur={this.onBlur}
              />
            );

            return (
              <Expression ref={tooltipContainerRef}
                $incorrect={!emptyResponse && !responseIsCorrect && !showCorrect}
                $correct={!emptyResponse && (responseIsCorrect || showCorrect)}
                $showCorrectness={!emptyResponse && disabled && correctness && !view}
                $correctAnswerShown={showCorrect}
              >
                <Tooltip
                  ref={(ref) => this.setTooltipRef(ref)}
                  enterTouchDelay={0}
                  interactive
                  open={activeAnswerBlock === `r${id}`}
                  slotProps={{
                    popper: {
                      container: tooltipContainerRef?.current || undefined,
                      placement: 'bottom-end',
                      sx: {
                        backgroundColor: 'transparent',
                        width: '650px',
                        opacity: 1,
                        '& .MuiTooltip-arrow': {
                          display: 'none',
                        },
                      },
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
                    tooltip: {
                      sx: {
                        fontSize: 'initial',
                        backgroundColor: 'transparent',
                        width: '600px',
                        marginTop: 0,
                        paddingTop: 0,
                        boxShadow: 'none',
                      },
                    },
                  }}
                  title={Object.keys(session.answers).map(
                    (answerId) =>
                      (answerId === activeAnswerBlock && !(showCorrect || disabled) && (
                        <ResponseContainer
                          data-keypad={true}
                          key={answerId}
                          style={{ width: getKeyPadWidth(additionalKeys, equationEditor) }}
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
                  {studentPrintMode ? (
                    <PrintContainer>{MQStatic}</PrintContainer>
                  ) : (
                    <div>
                      {MQStatic}
                    </div>
                  )}
                </Tooltip>
              </Expression>
            );
          }}
        />
      </InputAndKeypadContainer>
    );
  };

  render() {
    const { model } = this.props;
    const { showCorrect } = this.state;
    const {
      prompt,
      env: { mode, role } = {},
      extraCSSRules,
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
      <StyledUiLayout
        extraCSSRules={extraCSSRules}
        ref={(r) => {
          // eslint-disable-next-line react/no-find-dom-node
          const domNode = ReactDOM.findDOMNode(r);

          this.root = domNode || this.root;
        }}
      >
        <MainContainer>
          {/* what is srOnly ? */}
          {mode === 'gather' && <SrOnly>Math Equation Response Question</SrOnly>}

          <MainContainer>
            {showCorrectAnswerToggle && (
              <StyledToggle
                language={language}
                show
                toggled={showCorrect}
                onToggle={this.toggleShowCorrect}
              />
            )}
          </MainContainer>

          {this.renderTeacherInstructions()}

          {prompt && (
            <PromptContainer>
              <PreviewPrompt prompt={prompt} />
            </PromptContainer>
          )}

          <Readable false>{this.renderPlayerContent()}</Readable>

          {displayNote && <Note className="note" dangerouslySetInnerHTML={{ __html: note }} />}

          {this.renderRationale()}
        </MainContainer>
      </StyledUiLayout>
    );
  }
}

export default Main;
